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
            response = jsonify([{'name': l.name, 'cards': get_cards(l)} for l in List.get_all()])
            response.status_code = 200
            return response

    @app.route('/scrumboard_api/<list_name>', methods=['GET'])
    def get_list(list_name):
        scrumlist = List.query.filter_by(name=list_name).first()
        response = jsonify({'name': scrumlist.name, 'cards': get_cards(scrumlist)})
        response.status_code = 200
        return response


    @app.route('/scrumboard_api/<list_name>', methods=['DELETE'])
    def delete_list(list_name):
        scrumlist = List.query.filter_by(name=list_name).first()
        scrumlist.delete()
        response = jsonify({'message': 'deleted list {}'.format(list_name)})
        response.status_code = 200
        return response

    @app.route('/scrumboard_api/<list_name>', methods=['PUT'])
    def add_card(list_name):
        scrumlist = List.query.filter_by(name=list_name).first()
        data = request.data
        scrumlist.cards.append(Card(title=data['title'], description=data['description'], list=scrumlist))
        scrumlist.save()
        response = jsonify({'name': scrumlist.name, 'cards': get_cards(scrumlist)})
        response.status_code = 200
        return response


    @app.route('/scrumboard_api/cards/<card_title>', methods=['DELETE'])
    def delete_card(card_title):
        scrumcard = Card.query.filter_by(title=card_title).first()
        scrumlist = List.query.filter_by(name=request.data['list']).first()
        scrumlist.cards.remove(scrumcard)
        scrumlist.save()
        response = jsonify({'message': 'deleted card {}'.format(card_title)})
        response.status_code = 200
        return response




    return app
