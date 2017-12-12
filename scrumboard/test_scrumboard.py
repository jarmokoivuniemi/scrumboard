import unittest
import os
import json
from app import create_app, db, jsonify
example_list = {
        'name': 'TODO',
        'cards': [
            {
                'title': 'TDD AngularJS',
                'description': '...or die trying',
                'list': 'TODO',
                },
            {
                'title': 'Fix HTML',
                'description': '...or die trying',
                'list': 'TODO',
                }
            ]
        }

class TestScrumboard(unittest.TestCase):
    
    def setUp(self):
        self.app = create_app(config_name='testing')
        self.client = self.app.test_client

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_list_creation(self):
        response = self.client().post('/scrumboard_api/', data=json.dumps(example_list), content_type='application/json')
        self.assertEqual(201, response.status_code)
        self.assertIn('TODO', str(response.data))
        self.assertIn('TDD', str(response.data))

    def test_fetch_lists(self):
        self.client().post('/scrumboard_api/', data=json.dumps(example_list), content_type='application/json')
        response = self.client().get('/scrumboard_api/')
        self.assertEqual(200, response.status_code)
        self.assertIn('TODO', str(response.data))
        self.assertIn('TDD', str(response.data))

if __name__ == '__main__':
    unittest.main()

