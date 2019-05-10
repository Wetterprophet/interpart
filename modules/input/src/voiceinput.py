from google.cloud import speech_v1
from google.cloud.speech_v1 import enums, types
import logging
import io
import pyaudio
import sys
import re
import threading
import time 
from six.moves import queue
from langcodes import best_match

class MicrophoneStream(object):
    """Opens a recording stream as a generator yielding the audio chunks."""
    def __init__(self, rate, chunk):
        self._rate = rate
        self._chunk = chunk

        # Create a thread-safe buffer of audio data
        self._buff = queue.Queue()
        self.closed = True

    def __enter__(self):
        self._audio_interface = pyaudio.PyAudio()
        self._audio_stream = self._audio_interface.open(
            format=pyaudio.paInt16,
            # The API currently only supports 1-channel (mono) audio
            # https://goo.gl/z757pE
            channels=1, rate=self._rate,
            input=True, frames_per_buffer=self._chunk,
            # Run the audio stream asynchronously to fill the buffer object.
            # This is necessary so that the input device's buffer doesn't
            # overflow while the calling thread makes network requests, etc.
            stream_callback=self._fill_buffer,
        )

        self.closed = False

        return self

    def __exit__(self, type, value, traceback):
        self._audio_stream.stop_stream()
        self._audio_stream.close()
        self.closed = True
        # Signal the generator to terminate so that the client's
        # streaming_recognize method will not block the process termination.
        self._buff.put(None)
        self._audio_interface.terminate()

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
        """Continuously collect data from the audio stream, into the buffer."""
        #print(".", end ="")
        self._buff.put(in_data)
        return None, pyaudio.paContinue

    def generator(self):
        while not self.closed:
            # Use a blocking get() to ensure there's at least one chunk of
            # data, and stop iteration if the chunk is None, indicating the
            # end of the audio stream.
            chunk = self._buff.get()
            if chunk is None:
                return
            data = [chunk]

            # Now consume whatever other data's still buffered.
            while True:
                try:
                    chunk = self._buff.get(block=False)
                    if chunk is None:
                        return
                    data.append(chunk)
                except queue.Empty:
                    break

            yield b''.join(data)

class VoiceInput:

    def __init__(self, language, supported_languages):
        self.language = best_match(language, supported_languages)[0]
        logging.info("created speech input for language: " + self.language)
        if (self.language == None or self.language == "und"):
            raise ValueError("Language is not supported")
        self.client = speech_v1.SpeechClient()
        
    def makeConfig(self, sample_rate):
        encoding = enums.RecognitionConfig.AudioEncoding.LINEAR16
        sample_rate_hertz = sample_rate
        language_code = self.language

        return {'encoding': encoding, 'sample_rate_hertz': sample_rate_hertz, 'language_code': language_code}

    def listenToMic(self, record_duration, oneWord = False):
        MIC_SAMPLE_RATE = 16000
        MIC_CHUNK_SIZE = int(MIC_SAMPLE_RATE / 10)  # 100ms

        streaming_config = types.StreamingRecognitionConfig(config=self.makeConfig(MIC_SAMPLE_RATE), interim_results=True)

        with MicrophoneStream(MIC_SAMPLE_RATE, MIC_CHUNK_SIZE) as stream:
            audio_generator = stream.generator()
            requests = (types.StreamingRecognizeRequest(audio_content=content) for content in audio_generator)
            responses = self.client.streaming_recognize(streaming_config, requests)
            
            if oneWord:
                logging.info("started speech detection - listening for one word.")
            else:
                logging.info("started speech detection for {} seconds.".format(record_duration))
            thread = TranscribeThread(responses)
            thread.start()
            if oneWord:
                while len(thread.result) < 1:
                    time.sleep(0.1)
                thread.stop()
            else:
                # record for x seconds
                time.sleep(record_duration)
                thread.stop()
                
        # wait for thread to end & read result
        if oneWord:
            result = thread.result
            thread.join()
        else:
            thread.join()
            result = thread.result
            
        logging.info("finished speech detection")

        return result
        

    # def listenToFile(self, stream_file):
    #     FILE_SAMPLE_RATE = 44100

    #     with io.open(stream_file, 'rb') as audio_file:
    #         content = audio_file.read()

    #     stream = [content]
    #     chunks = (types.StreamingRecognizeRequest(audio_content=chunk) for chunk in stream)
        
    #     streaming_config = types.StreamingRecognitionConfig(config=self.makeConfig(FILE_SAMPLE_RATE), interim_results=True)

    #     responses = self.client.streaming_recognize(streaming_config, chunks)

    #     logging.info("started speech detection")
    #     # pick output text
    #     # output = None
    #     # for response in responses:
    #     #     for result in response.results:
    #     #         output = result
    #     #         print(result)
    #     result = transcribe_speech(responses)
    #     logging.info("stopped speech detection")

    #     return result

class TranscribeThread (threading.Thread):
    def __init__(self, responses, output=True):
        threading.Thread.__init__(self)
        self.responses = responses
        self.output = output

        self.result = ""

    def run(self):
        self.running = True

        output = self.output

        num_chars_printed = 0
        for response in self.responses:

            if not output:
                sys.stdout.write(".")
                sys.stdout.flush()

            if not response.results:
                continue

            # The `results` list is consecutive. For streaming, we only care about
            # the first result being considered, since once it's `is_final`, it
            # moves on to considering the next utterance.
            result = response.results[0]
            if not result.alternatives:
                continue

            # Display the transcription of the top alternative.
            transcript = result.alternatives[0].transcript

            # Display interim results, but with a carriage return at the end of the
            # line, so subsequent lines will overwrite them.
            #
            # If the previous result was longer than this one, we need to print
            # some extra spaces to overwrite the previous result
            overwrite_chars = ' ' * (num_chars_printed - len(transcript))

            if not result.is_final:
                if (output):
                    sys.stdout.write(transcript + overwrite_chars + '\r')
                    sys.stdout.flush()
                num_chars_printed = len(transcript)

            else:
                if (output):
                    print(transcript + overwrite_chars)
                self.result += transcript
                num_chars_printed = 0
            
            if not self.running:
                print("\r")
                break

    def stop(self):
        self.running = False
    

def toAscii(string):
    return str(string.encode('ascii', 'backslashreplace'))
