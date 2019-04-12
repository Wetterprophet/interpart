import requests

class RestClient:

    def __init__(self, apiAdress):
        self.apiAdress = apiAdress

    def getQuestions(self, language):
        url = self.apiAdress + "/questions/list?lang=" + language
        response = requests.get(url)
        questions = response.json()["data"]
        return questions