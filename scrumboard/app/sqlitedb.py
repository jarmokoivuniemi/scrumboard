from pony.orm import Database, Required, Set, db_session, select, delete, PrimaryKey, Optional
from pony.orm.serialization import to_dict

class SQLiteDB:
    db = Database()

    class List(db.Entity):
        name = PrimaryKey(str)
        cards = Set('Card')

    class Card(db.Entity):
        title = PrimaryKey(str)
        description = Optional(str)
        list = Required('List')

    def __init__(self, db_name):
        self.db.bind(provider='sqlite', filename=db_name, create_db=True)
        self.db.generate_mapping(create_tables=True)

    @db_session
    def add_list(self, l):
        self.List(name=l['name'], cards=[])

    @db_session
    def get_lists(self):
        lists = select(l for l in self.List)
        return [{'name': l.name, 'cards': self._cards_for_list(l)} for l in lists]

    @db_session
    def drop_all(self):
        delete(l for l in self.List)

    @db_session
    def delete_list(self, list_name):
        delete(l for l in self.List if l.name == list_name)

    @db_session
    def add_card(self, card):
        self.Card(title=card['title'], description=card['description'], list=card['list'])

    @db_session
    def get_cards_by_list(self, list_name):
        cards = select(c for c in self.Card if c.list.name == list_name)
        return [{'title': c.title, 'description': c.description, 'list': c.list.name} for c in cards]

    @db_session
    def delete_card(self, card_title):
        delete(c for c in self.Card if c.title == card_title)

    @db_session
    def move_card(self, card):
        c = self.Card[card['title']]
        c.list = self.List[card['list']]

    @db_session
    def find_list_by_name(self, list_name):
        l = self.List[list_name]
        return {'name': l.name, 'cards': 
                self._cards_for_list(l)}

    def _cards_for_list(self, l):
        return [{'title': c.title, 'description': c.description, 'list': c.list.name} for c in l.cards]

