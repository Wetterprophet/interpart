import logging
from src.main import run
from config import config

logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':
    run(config)
