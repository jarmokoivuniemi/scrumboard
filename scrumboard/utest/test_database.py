from app.database import Database
from unittest import TestCase
from nose.tools import assert_equal, assert_true


class TestDatabase(TestCase):

    def setUp(self):
        self.db = Database()
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

    def add_list_to_db(self, l):
        self.db.add_list(l)

    def add_card_to_list(self, card):
        self.db.add_card(card)
    
    def test_given_empty_database_when_add_new_list(self):
        self.add_list_to_db(self.sample_list1)

        assert_true('List name' in [l['name'] for l in self.db.get_lists()], 
                'then added list should be in database')

    def test_given_one_list_in_db_when_delete_list(self):
        self.add_list_to_db(self.sample_list1)

        self.db.delete_list('List name')

        assert_equal(0, len(self.db.get_lists()), 'then database should have no lists')
    
    def test_given_list_exists_when_add_card_to_list(self):
        self.add_list_to_db(self.sample_list1)

        self.add_card_to_list(self.sample_card1)

        assert_equal([self.sample_card1], self.db.get_cards_by_list('List name'), 
                'then added card should be on that list')

    def test_given_list_has_one_card_when_delete_card(self):
        self.add_list_to_db(self.sample_list1)
        
        self.add_card_to_list(self.sample_card1)

        self.db.delete_card(self.sample_card1['title'])

        assert_equal(0, len(self.db.get_cards_by_list('List name')),
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

        self.db.move_card(modified_card)

        assert_equal('Card title', self.db.lists[1]['cards'][0]['title'],
                'then card should be moved to new list')
        assert_equal(0, len(self.db.lists[0]['cards']),
                'then card should be removed from old list')



