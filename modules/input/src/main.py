import random
import logging
import json
import time
from subprocess import call

from .keyboardinput import KeyGrabber 
from .voiceinput import VoiceInput 
from .statemachine import StateMachine, Action, State
from .restclient import RestClient

logging.basicConfig(level=logging.INFO)

running = True

def run(config):
    global running

    #initialize
    logging.info("started script")
    state = StateMachine(State.WAITING_FOR_KEY)
    restClient = RestClient("http://localhost:3030")

    while running:
        if (state.status == State.WAITING_FOR_KEY):
            # listen to key
            keyInput = KeyGrabber()
            language = keyInput.read()

            state.consumeAction(Action.SET_LANGUAGE, language = language)
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
            speakText(state.question["text"], state.language)
            state.consumeAction(Action.DONE)

        elif state.status == State.LISTENING:
            # listening for voice input
            try:
                voiceInput = VoiceInput(state.language, config["SUPPORTED_LANGUAGES"])
                answer = voiceInput.listenToMic(config["RECORDING_DURATION"])
                #answer = voiceInput.listenToFile("data/georgisch.wav")
                state.consumeAction(Action.SEND_ANSWER, answer = answer)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))
            
        elif state.status == State.SENDING:
            logging.info("answer: " + str(state.answer))
            try:
                translations = restClient.postAnswer(state.answer, state.language)
                # print(json.dumps(translations, indent=4))
                state.consumeAction(Action.DONE)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))
        elif state.status == State.OUTPUT:
            speakText("You responded: " + state.answer, state.language)
            state.consumeAction(Action.DONE)
            #stop()

        elif state.status == State.ERROR:
            logging.error(state.error)
            time.sleep(3.0)
            state.consumeAction(Action.TIMEOUT)

    logging.info("stopped loop")

def stop():
    global running
    running = False

def speakText(text, language):
    call('../speak/.venv/bin/python ../speak/speak.py \"{}\" --lang {}'.format(text,language), shell=True)
