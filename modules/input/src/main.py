import random
import logging
import json
import time
from os import system
from subprocess import call, check_output

from .keyboardinput import KeyGrabber 
from .voiceinput import VoiceInput 
from .statemachine import StateMachine, Action, State
from .restclient import RestClient
from .audio.speak import speak
from .hardware.leds import Leds,Color,LedsDummy

logging.basicConfig(level=logging.INFO)

running = True

def run(config):
    global running

    #initialize
    logging.info("started script")
    state = StateMachine(State.WAITING_FOR_KEY)
    restClient = RestClient("http://localhost:3030")

    try:
        led = Leds()
    except:
        led = LedsDummy()

    led.update(Leds.rgb_off())

    while running:
        if (state.status == State.WAITING_FOR_KEY):
            # listen to key
            keyInput = KeyGrabber()
            language = keyInput.read()

            state.consumeAction(Action.SET_LANGUAGE, language = language)

        elif state.status == State.ASKING_FOR_NAME:
            logging.info("fetching name question...")
            try:
                questions = restClient.getNameQuestion(state.language)
                nameQuestion = questions[random.randint(0, len(questions) - 1)]
                led.update(Leds.rgb_on(Color.BLUE))
                speakText(nameQuestion["text"], state.language)
                led.update(Leds.rgb_off())
                state.consumeAction(Action.DONE)
            except:
                state.consumeAction(Action.THROW_ERROR, error = "Failed fetching or speaking question")

        elif state.status == State.LISTENING_FOR_NAME:
            logging.info("listening for name")
            try:
                voiceInput = VoiceInput(state.language, config["SUPPORTED_LANGUAGES"])
                led.update(Leds.rgb_on(Color.RED))
                answer = voiceInput.listenToMic(silenceTimeout = 1.0)
                led.update(Leds.rgb_off())
                logging.info("user name is: " + answer )
                state.consumeAction(Action.SET_NAME, name = answer)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))

        elif state.status == State.FETCH_QUESTION:
            logging.info("fetching question...")
            try:
                 # fetch question from database
                questions = restClient.getQuestions(state.language)
                # pick random questions
                question = questions[random.randint(0, len(questions) - 1)]
                state.consumeAction(Action.SET_QUESTION, question = question)
            except:
                state.consumeAction(Action.THROW_ERROR, error = "Could not fetch question")

        elif state.status == State.ASKING_QUESTION:
            logging.info("asking question: " + str(state.question))
            led.update(Leds.rgb_on(Color.BLUE))
            speakText(state.question["text"], state.language)
            led.update(Leds.rgb_off())
            state.consumeAction(Action.DONE)

        elif state.status == State.LISTENING:
            logging.info("listening for voice input")
            try:
                voiceInput = VoiceInput(state.language, config["SUPPORTED_LANGUAGES"])
                led.update(Leds.rgb_on(Color.RED))
                answer = voiceInput.listenToMic(silenceTimeout = config["SPEAKING_ANSWER_TIMEOUT"])
                led.update(Leds.rgb_off())
                #answer = voiceInput.listenToFile("data/georgisch.wav")
                state.consumeAction(Action.SET_ANSWER, answer = answer)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))
            
        elif state.status == State.OUTPUT:
            if not state.answer:
                state.consumeAction(Action.THROW_ERROR, error = "Answer is empty")
            else:
                led.update(Leds.rgb_on(Color.BLUE))
                speakText(state.answer, state.language)
                led.update(Leds.rgb_off())
                state.consumeAction(Action.DONE)

        elif state.status == State.SENDING:
            logging.info("answer: " + str(state.answer))
            try:
                response = restClient.postAnswer(state.answer, state.language, state.author)
                logging.info("answer got posted to server. ")
                printSubmission(response['data'], "en, de")
                logging.info("answer got printed. ")
                time.sleep(3.0)
                state.consumeAction(Action.DONE)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))

        elif state.status == State.ERROR:
            logging.error(state.error)
            time.sleep(5.0)
            state.consumeAction(Action.TIMEOUT)

    logging.info("stopped loop")
    led.update(Leds.rgb_off())

def stop():
    global running
    running = False

def speakText(text, language):
    speak(text, language, )
    # call('../speak/.venv/bin/python ../speak/speak.py \"{}\" --lang {}'.format(text, language), shell=True)

def toAscii(string):
    return str(string.encode('ascii', 'backslashreplace'))

def printSubmission(submission, languages):
    # generate pdf
    jsonString = json.dumps(submission, separators=(',', ':')).replace('"', '\\"')
    filePath = check_output(['interpart-pdf --submission "{}\"'.format(jsonString)], shell=True)

    #encode as string and remove line ending
    filePath = filePath.decode("utf-8").rstrip("\n\r")

    # send file to printer
    system('lp -o media=A5 {}'.format(filePath))
