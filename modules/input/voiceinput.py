from google.cloud import speech_v1
from google.cloud.speech_v1 import enums, types

import logging
import io

class VoiceInput:

    def __init__(self, language):
        logging.info("created speech input for language: " + language)
        self.language = language
        self.client = speech_v1.SpeechClient()

        encoding = enums.RecognitionConfig.AudioEncoding.LINEAR16
        sample_rate_hertz = 44100
        language_code = 'en-US'

        self.config = {'encoding': encoding, 'sample_rate_hertz': sample_rate_hertz, 'language_code': language_code}
        

    def listen(self, stream_file):

        with io.open(stream_file, 'rb') as audio_file:
            content = audio_file.read()

        audio = speech_v1.types.RecognitionAudio(content=content)
        logging.info("voice recognition started")
        response = self.client.recognize(config=self.config, audio=audio)
        logging.info("voice recognition stopped")
        result = response.results[0]
        return result.alternatives[0].transcript