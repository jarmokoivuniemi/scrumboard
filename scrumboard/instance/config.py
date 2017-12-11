import os

class Config:
    DEBUG = False
    CSRF_ENABLED = True
    SECRET = os.getenv('SECRET')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')


class Development(Config):
    DEBUG = True


class Testing(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'postgresql:///test_db'
    DEBUG = True


class Staging(Config):
    DEBUG = True


class Production(Config):
    DEBUG = False
    TESTING = False


app_config = {
        'development': Development,
        'testing': Testing,
        'staging': Staging,
        'production': Production,
        }
