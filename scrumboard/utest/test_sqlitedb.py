from unittest import TestCase, SkipTest
from app.sqlitedb import SQLiteDB
from utest.in_memory_db import db
from nose.tools import assert_equal, assert_true, assert_in, assert_not_in

class TestSQLiteDB(TestCase):

    def setUp(self):
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
    def tearDown(self):
        db.drop_all()

    def add_list_to_db(self, new_list):
        db.add_list(new_list)

    def add_card_to_list(self, card):
        db.add_card(card)

    def test_given_empty_database_when_add_new_list(self):
        self.add_list_to_db(self.sample_list1)

        assert_true('List name' in [l['name'] for l in db.get_lists()], 
                'then added list is in database')

    def test_given_one_list_in_db_when_delete_list(self):
        self.add_list_to_db(self.sample_list1)

        db.delete_list('List name')

        assert_equal(0, len(db.get_lists()), 'then database has no lists')

    def test_given_list_exists_when_add_card_to_list(self):
        self.add_list_to_db(self.sample_list1)

        self.add_card_to_list(self.sample_card1)

        assert_equal([self.sample_card1], db.get_cards_by_list('List name'), 
                'then added card is added to that list')

    def test_given_list_has_one_card_when_delete_card(self):
        self.add_list_to_db(self.sample_list1)
        
        self.add_card_to_list(self.sample_card1)

        db.delete_card(self.sample_card1['title'])

        assert_equal(0, len(db.get_cards_by_list('List name')),
                'then list should have no cards')

    def test_given_list_has_one_card_when_card_changes_list(self):
        self.add_list_to_db(self.sample_list1)
        self.add_list_to_db(self.sample_list2)
        
        self.add_card_to_list(self.sample_card1)

        modified_card = {
                'title': 'Card title',
                'description': 'Card description',
                'list': 'Another list',
                }

        db.move_card(modified_card)

        assert_equal('Card title', db.get_lists()[1]['cards'][0]['title'],
                'then card is moved to new list')
        assert_equal(0, len(db.get_lists()[0]['cards']),
                'then card is removed from old list')
    
    def test_list_with_card(self):
        self.add_list_to_db(self.sample_list1)
        
        self.add_card_to_list(self.sample_card1)

        assert_equal('Card title', db.get_lists()[0]['cards'][0]['title'])

    def test_change_card_title(self):
        self.add_list_to_db(self.sample_list1)
        
        self.add_card_to_list(self.sample_card1)

        modified_card = {
                'title': 'Card title',
                'description': 'Card description',
                'list': 'Another list',
                }




