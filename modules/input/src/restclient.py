import requests
import json

class RestClient:

    def __init__(self, apiAdress):
        self.apiAdress = apiAdress

    def getQuestions(self, language):
        url = self.apiAdress + "/questions/list?lang=" + language
        response = requests.get(url)
        questions = response.json()["data"]
        return questions

    def getNameQuestion(self, language):
        url = self.apiAdress + "/questions/name?lang=" + language
        response = requests.get(url)
        questions = response.json()["data"]
        return questions

    def postAnswer(self, submission):
        url = self.apiAdress + "/submissions/add"
        response = requests.post(url, json=submission)
        return response.json()