import random

from keyboardinput import KeyGrabber 
# import VoiceInput from voiceInput
from statemachine import StateMachine, Action, State
from restclient import RestClient

def main():
    #initialize
    running = True
    state = StateMachine()
    restClient = RestClient("http://localhost:3030")

    while running:
        if (state.status == State.WAITING_FOR_KEY):
            # listen to key
            keyInput = KeyGrabber()
            language = keyInput.read()

            state.consumeAction(Action.SET_LANGUAGE, language = language)
        elif state.status == State.ASKING_QUESTION:
            print("getting question... ")

            # fetch question from database
            questions = restClient.getQuestions(state.language)

            # pick random questions
            question = questions[random.randint(0, len(questions) - 1)]

            state.consumeAction(Action.SET_QUESTION, question = question)
        elif state.status == State.LISTENING:
            print("listening for input")
            input()



if __name__ == '__main__':
    main()
