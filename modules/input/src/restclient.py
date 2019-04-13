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

    def postAnswer(self, answer, language):
        url = self.apiAdress + "/submissions/add"
        payload = {
            "text" : answer,
            "language" : language
        }
        response = requests.post(url, json=payload)
        return response.json()