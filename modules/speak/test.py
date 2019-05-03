from subprocess import call

def speakText(text, language):
    print(text)
    call('.venv/bin/python speak.py \"{}\" --lang {} -d'.format(text, language), shell=True)

speakText("مرحبا","ar")
