from google.cloud import speech_v1
from google.cloud.speech_v1 import enums, types

import logging
import io

class VoiceInput:

    def __init__(self, language):
        logging.info("created speech input for language: " + language)
        self.language = language
        self.client = speech_v1.SpeechClient()

        
        
    def makeConfig(self):
        encoding = enums.RecognitionConfig.AudioEncoding.LINEAR16
        sample_rate_hertz = 44100
        language_code = 'en-US'

        return {'encoding': encoding, 'sample_rate_hertz': sample_rate_hertz, 'language_code': language_code}

    def listen(self, stream_file):

        with io.open(stream_file, 'rb') as audio_file:
            content = audio_file.read()

        stream = [content]
        chunks = (types.StreamingRecognizeRequest(audio_content=chunk) for chunk in stream)
        
        streaming_config = types.StreamingRecognitionConfig(config=self.makeConfig())

        responses = self.client.streaming_recognize(streaming_config, chunks)

        # pick output text
        output = None
        for response in responses:
            for result in response.results:
                output = result
                print(result)

        return output.alternatives[0]