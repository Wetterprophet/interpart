import random
import logging

from keyboardinput import KeyGrabber 
from voiceinput import VoiceInput 
from statemachine import StateMachine, Action, State
from restclient import RestClient

logging.basicConfig(level=logging.INFO)

running = True

def main():
    global running
    #initialize
    logging.info("started script")
    state = StateMachine()
    restClient = RestClient("http://localhost:3030")

    while running:
        if (state.status == State.WAITING_FOR_KEY):
            # listen to key
            keyInput = KeyGrabber()
            language = keyInput.read()

            state.consumeAction(Action.SET_LANGUAGE, language = language)
        elif state.status == State.FETCH_QUESTION:

            # fetch question from database
            questions = restClient.getQuestions(state.language)

            # pick random questions
            question = questions[random.randint(0, len(questions) - 1)]

            state.consumeAction(Action.SET_QUESTION, question = question)
        elif state.status == State.ASKING_QUESTION:
            logging.info("asking question: " + str(state.question))

            state.consumeAction(Action.DONE)
        elif state.status == State.LISTENING:
            # listening for voice input
            voiceInput = VoiceInput(state.language)
            answer = voiceInput.listen("data/test.wav")
            state.consumeAction(Action.SEND_ANSWER, answer = answer)
        elif state.status == State.SENDING:
            logging.info("answer: " + str(state.answer))
            stop()

    logging.info("stopped loop")

def stop():
    global running
    running = False

if __name__ == '__main__':
    main()
