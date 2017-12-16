from flask import Flask, render_template, jsonify, request, abort
from database import Database
from sqlitedb import SQLiteDB
import json


def create_app(db):


    app = Flask(__name__)

    @app.route('/')
    def index():
        return render_template('index.html')


    @app.route('/api/lists', methods=['GET'])
    def get_lists():
        return jsonify(db.get_lists())


    @app.route('/api/lists', methods=['POST'])
    def post_list():
        db.add_list(request.get_json())
        return request.data


    @app.route('/api/lists/<list_name>', methods=['DELETE'])
    def delete_list(list_name):
        db.delete_list(list_name)
        response = jsonify({})
        response.status_code = 204
        return response


    @app.route('/api/lists/<list_name>', methods=['GET'])
    def get_one_list(list_name):
        return jsonify(db.find_list_by_name(list_name))


    @app.route('/api/cards', methods=['POST'])
    def post_card():
        print(request.get_json())
        db.add_card(request.get_json())
        return jsonify(request.get_json())


    @app.route('/api/cards/<card_title>', methods=['PUT'])
    def move_card(card_title):
        db.move_card(request.get_json())
        return jsonify({})


    @app.route('/api/cards/<card_title>', methods=['GET'])
    def get_card(card_title):
        return jsonify({})


    @app.route('/api/cards/<card_title>', methods=['DELETE'])
    def delete_card(card_title):
        db.delete_card(card_title)
        return jsonify({})
    
    return app


if __name__ == '__main__':
    create_app(SQLiteDB('test.db')).run(debug=True)
