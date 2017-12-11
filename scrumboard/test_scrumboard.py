import unittest
import os
import json
from app import create_app, db

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
        l = {
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
        result = self.client().post('/scrumboard_api/', data=json.dumps(l))
        self.assertEqual(200, result.status_code)

if __name__ == '__main__':
    unittest.main()

