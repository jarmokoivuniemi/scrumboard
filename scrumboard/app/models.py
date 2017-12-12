from app import db
from sqlalchemy.orm import joinedload

class List(db.Model):
    name = db.Column(db.String(255), primary_key=True)
    cards = db.relationship('Card',
            backref='list',
            lazy='dynamic')

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return List.query.all()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Card(db.Model):
    title = db.Column(db.String(255), primary_key=True)
    description = db.Column(db.String(255))
    list_name = db.Column(db.String(255), db.ForeignKey('list.name'), nullable=False)

    def __init__(self, title, description, list_name):
        self.title = title
        self.description = description
        self.list_name = list_name

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Card.query.all()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return '{}'.format(self.title)
