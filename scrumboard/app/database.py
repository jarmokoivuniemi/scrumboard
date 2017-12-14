from collections import defaultdict


class Database:

    def __init__(self):
        self.lists = []

    def add_list(self, new_list):
        self.lists.append(new_list)

    def delete_list(self, list_name):
        self.lists.remove(self.find_list_by_name(list_name))

    def get_lists(self):
        return self.lists

    def add_card(self, new_card):
        target_list = next(l for l in self.lists if new_card['list'] == l['name'])
        target_list['cards'].append(new_card)

    def delete_card(self, card_title):
        card, card_list = next((c, l) 
                for l in self.lists 
                for c in l['cards'] 
                if card_title == c['title'])
        card_list['cards'].remove(card)

    def move_card(self, card):
        target_card, old_list = next((c, l) 
                for l in self.lists 
                for c in l['cards'] 
                if card['title'] == c['title'])

        target_list = self.find_list_by_name(card['list'])
        target_list['cards'].append(target_card)
        old_list['cards'].remove(target_card)
        
    def get_cards_by_list(self, list_name):
        return self.find_list_by_name(list_name)['cards']

    def find_list_by_name(self, list_name):
        return next(l for l in self.lists if l['name'] == list_name)

    def drop_all(self):
        self.lists = []
