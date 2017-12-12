from flask_api import FlaskAPI
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify, abort

from instance.config import app_config

db = SQLAlchemy()

def create_app(config_name):
    app = FlaskAPI(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    from app.models import List
    
    @app.route('/scrumboard_api/', methods=['POST', 'GET'])
    def lists():
        if request.method == 'POST':
            name = str(request.data.get('name', ''))
            if name:
               scrumlist = List(name=name)
               scrumlist.save()
               response = jsonify({
                   'id': scrumlist.id,
                   'name': scrumlist.name,
                   })
               response.status_code = 201
               return response
        else:
            lists = List.get_all()
            response = jsonify([{'name': l.name} for l in lists])
            response.status_code = 200
            return response




    return app
