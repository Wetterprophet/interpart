from enum import Enum, auto
import logging

class State(Enum):
    WAITING_FOR_KEY = auto(),
    FETCH_QUESTION = auto(),
    ASKING_QUESTION = auto(),
    LISTENING = auto(),
    SENDING = auto(),
    OUTPUT = auto()

class Action(Enum):
    SET_LANGUAGE = auto(),
    SET_QUESTION = auto(),
    DONE = auto(),
    SEND_ANSWER = auto(),
    RECEIVED_TRANSLATION = auto(),
    RESET = auto(),
    ERROR = auto()

class StateMachine:
    def __init__(self, initialState = State.WAITING_FOR_KEY):
        self.initialState = initialState
        self.reset()

    def reset(self):
        self.status = self.initialState
        self.language = None
        self.question = None
        self.answer = None

    def consumeAction(self, action, **args):
        if action == Action.RESET:
            self.reset()

        if action == Action.ERROR:
            logging.error(args.get("error"))
            self.reset()

        if self.status == State.WAITING_FOR_KEY:
            if action == Action.SET_LANGUAGE:
                self.language = args.get("language")
                self.status = State.FETCH_QUESTION
        elif self.status == State.FETCH_QUESTION:
            if action == Action.SET_QUESTION:
                self.question = args.get("question")
                self.status = State.ASKING_QUESTION
        elif self.status == State.ASKING_QUESTION:
            if action == Action.DONE:
                self.status = State.LISTENING
        elif self.status == State.LISTENING:
            if action == Action.SEND_ANSWER:
                self.answer = args.get("answer")
                self.status = State.SENDING
        elif self.status == State.SENDING:
            if action == Action.RECEIVED_TRANSLATION:
                self.status = State.OUTPUT
        elif self.status == State.OUTPUT:
            if action == Action.DONE:
                self.reset()
