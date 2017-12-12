from app import db
from sqlalchemy.orm import joinedload

class List(db.Model):
    name = db.Column(db.String(50), primary_key=True)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return List.query.options(joinedload('cards'))

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Card(db.Model):
    title = db.Column(db.String(255), primary_key=True)
    description = db.Column(db.String(255))
    list_name = db.Column(db.String(50), db.ForeignKey('list.name'), nullable=False)
    list = db.relationship('List',
            backref=db.backref('cards', lazy=True))

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return '{}'.format(self.title)
