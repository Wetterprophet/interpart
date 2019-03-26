from PIL import Image, ImageDraw, ImageFont ##pillow.readthedocs.io
from gtts import gTTS
import json
import os	##to use cli-commands
import speech_recognition as sr
r = sr.Recognizer()
m = sr.Microphone()

##identify with google credentials (not yet tested)
##export GOOGLE_APPLICATION_CREDENTIALS="interPart-Babelfish-47325939d7af.json"


print("A moment of silence, please...")
with m as source: r.adjust_for_ambient_noise(source)
print("Set minimum energy threshold to {}".format(r.energy_threshold))
if True:
    print("Say something!")
    with m as source: audio = r.listen(source)
    print("Got it! Now to recognize it...")
    try:
        # recognize speech using Google Speech Recognition
        value = r.recognize_google(audio)
        # we need some special handling here to correctly print unicode characters to standard output
        if str is bytes:  # this version of Python uses bytes for strings (Python 2)
            print(u"You said {}".format(value).encode("utf-8"))
        else:  # this version of Python uses unicode for strings (Python 3+)
            print("You said {}".format(value))
    except sr.UnknownValueError:
        print("Oops! Didn't catch that")
    except sr.RequestError as e:
        print("Uh oh! Couldn't request results from Google Speech Recognition service; {0}".format(e))



outputLanguage = "en"
outputString = value
##outputString = "Was kostet Kuchen...? Irgendwie muss man ja mehr Text erzeugen. Ganz genau kann ich nicht sagen was mich dazu motiviert, jedoch ist das einfach so. Punkt. Basta!" ##zitat bodo
##outputString = "أشعر أنني بحالة جيدة في هذه المدينة" ##ich fühle mich wohl in dieser stadt
tts = gTTS(outputString, lang=outputLanguage)
tts.save('ttsfile.mp3')
fileName = "ttsfile.mp3"


# make a blank image for the text, initialized to white bg fill
txt = Image.new('RGB', (600, 400), (255,255,255,255))
# get a font
fnt = ImageFont.truetype('FreeMono.ttf', 60)
# get a drawing context
d = ImageDraw.Draw(txt)
# draw text, full opacity, black text fill
d.text((10,60), outputString, font=fnt, fill=(0,0,0,255))
txt.save("text.jpg", "JPEG")

os.system("echo " + outputString + " | lp") ##prints string on Printer
##os.system("lp -o orientation-requested=1 text.jpg") ##prints picture on Printer
os.system("mpg123 " + fileName) ##speaks the text directly via soundcard (usb)
##txt.show()
