from google.cloud import texttospeech
import pyaudio

SAMPLE_RATE = 44100

def speak(text, language):

    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.types.SynthesisInput(text=text)

    # Build the voice request
    voice = texttospeech.types.VoiceSelectionParams(
        language_code=language,
        ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

    # Select the type of audio file you want returned
    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.LINEAR16,
        sample_rate_hertz=SAMPLE_RATE
        )

    print("requesting sound stream for: {}".format(text))
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



