import sys, os
sys.path.append(os.path.realpath('app/'))
from app.app import app
from app.app import db
from unittest import TestCase
from nose.tools import assert_equal, assert_true, assert_in, assert_not_in
import json

class TestApp(TestCase):
    
    def setUp(self):
        self.client = app.test_client()
        self.sample_list1 = {
                'name': 'List name',
                'cards': []
                }
        self.sample_list2 = {
                'name': 'Another list', 
                'cards': [] 
                }
        self.sample_card1 = {
                'title': 'Card title',
                'description': 'Card description',
                'list': 'List name',
                }
        db.drop_all()

    def post(self, route, item):
        response = self.client.post(route, 
                data=json.dumps(item), 
                content_type='application/json')
        return response
        
    def test_get_lists(self):
        db.add_list(self.sample_list1)
        db.add_card(self.sample_card1)

        response = self.client.get('/api/lists')

        assert_equal(200, response.status_code)
        assert_in('List name' and 'Card title', str(response.data))

    def test_post_list(self):
        response = self.post('/api/lists', self.sample_list1)

        assert_equal(200, response.status_code)

        response = self.client.get('/api/lists')

        assert_equal(200, response.status_code)
        assert_in('List name', str(response.data))

    def test_delete_list(self):
        self.post('/api/lists', self.sample_list1)

        delete_response = self.client.delete('/api/lists/List name');

        assert_equal(204, delete_response.status_code)

        get_response = self.client.get('/api/lists')

        assert_not_in('List name', str(get_response.data))

    def test_get_one_list(self):
        self.post('/api/lists', self.sample_list1)

        response = self.client.get('/api/lists/List name')

        assert_in('List name', str(response.data))

    def test_post_card(self):
        db.add_list(self.sample_list1)

        self.post('/api/cards', self.sample_card1)

        response = self.client.get('/api/lists')

        assert_equal(200, response.status_code)
        assert_in('List name' and 'Card title', str(response.data))

    def test_move_card(self):
        db.add_list(self.sample_list1)
        db.add_list(self.sample_list2)
        db.add_card(self.sample_card1)

        changed_card = {
                'title': 'Card title',
                'description': 'Card description',
                'list': 'Another list',
                }

        response = self.client.put('/api/cards/Card title', 
                data=json.dumps(changed_card), 
                content_type='application/json')
        assert_equal(200, response.status_code)

        response = self.client.get('/api/lists/Another list')

        assert_in('Card title', str(response.data))
