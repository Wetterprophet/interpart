#!/usr/bin/env python

from google.cloud import texttospeech
import pyaudio
import argparse
import os

parser = argparse.ArgumentParser(description='Uses google text to speech api to speak out text')
parser.add_argument('text', help='text to speak')
parser.add_argument('-l', '--lang', default="en", help='the language the text should be spoken')
parser.add_argument('-d', '--decode', action='store_true', help='decodes input from utf8 byte string')

args = parser.parse_args()

SAMPLE_RATE = 44100

# Instantiates a client
client = texttospeech.TextToSpeechClient()

def decodeUtf8(string):
    x = os.fsdecode(string)
    return x.decode("utf8")

# Set the text input to be synthesized
text = decodeUtf8(args.text) if args.decode else args.text
print(text)

synthesis_input = texttospeech.types.SynthesisInput(text=text)

# Build the voice request
voice = texttospeech.types.VoiceSelectionParams(
    language_code=args.lang,
    ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

# Select the type of audio file you want returned
audio_config = texttospeech.types.AudioConfig(
    audio_encoding=texttospeech.enums.AudioEncoding.LINEAR16,
    sample_rate_hertz=SAMPLE_RATE
    )

print("requesting sound stream")
response = client.synthesize_speech(synthesis_input, voice, audio_config)

print("start playback")
pya = pyaudio.PyAudio()
stream = pya.open(format=pya.get_format_from_width(width=2), channels=1, rate=SAMPLE_RATE, output=True)
## remove the first 44 bytes from stream
stream.write(response.audio_content[44:])
stream.stop_stream()
stream.close()
pya.terminate()

print("playback stopped")