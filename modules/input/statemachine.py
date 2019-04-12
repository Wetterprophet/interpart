from enum import Enum

class State(Enum):
    WAITING_FOR_KEY = 1,
    ASKING_QUESTION = 2,
    LISTENING = 3,
    OUTPUT = 4

class Action(Enum):
    SET_LANGUAGE = 1,
    SET_QUESTION = 2,
    DONE_LISTENING = 3,
    RESET = 4

class StateMachine:
    def __init__(self):
        self.reset()


    def reset(self):
        self.status = State.WAITING_FOR_KEY
        self.language = None
        self.question = None

    def consumeAction(self, action, **args):
        if action == Action.RESET:
            self.reset()

        if self.status == State.WAITING_FOR_KEY:
            if action == Action.SET_LANGUAGE:
                self.language = args.get("language")
                self.status = State.ASKING_QUESTION
        elif self.status == State.ASKING_QUESTION:
            if action == Action.SET_QUESTION:
                self.question = args.get("question")
                self.status = State.LISTENING
        elif self.status == State.LISTENING:
            if action == Action.DONE_LISTENING:
                self.answer = args.get("answer")
                self.status = State.OUTPUT
