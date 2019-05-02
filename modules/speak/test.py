from subprocess import call

def speakText(text, language):
    print(text)
    call('.venv/bin/python speak.py \"{}\" --lang {} -d'.format(text.encode("utf8"),language), shell=True)

speakText("مرحبا","ar")