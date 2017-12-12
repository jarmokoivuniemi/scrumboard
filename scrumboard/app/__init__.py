from flask_api import FlaskAPI
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify, abort

from instance.config import app_config

db = SQLAlchemy()

def get_cards(scrumlist):
    return [str(card) for card in scrumlist.cards]

def create_app(config_name):
    app = FlaskAPI(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    from app.models import List, Card
    
    @app.route('/scrumboard_api/', methods=['POST', 'GET'])
    def lists():
        if request.method == 'POST':
            name = str(request.data.get('name', ''))
            if name:
               scrumlist = List(name=name)
               for card in request.data.get('cards', []):
                   scrumlist.cards.append(Card(
                       title=card['title'], 
                       description=card['description'], 
                       list=scrumlist))

               scrumlist.save()

               response = jsonify({'name': scrumlist.name, 'cards': get_cards(scrumlist)})
               response.status_code = 201
               return response
        else:
            lists = List.get_all()
            response = jsonify([{'name': l.name, 'cards': get_cards(l)} for l in lists])
            response.status_code = 200
            return response




    return app
