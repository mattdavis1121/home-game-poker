import random
from database import db, BaseModel


def make_random_name():
    adjectives = ["quickly", "grossly", "slowly", "heavily", "noisily", "aptly", "strongly", "mechanically", "barely", "tirelessly"]
    gerunds = ["running", "jumping", "eating", "talking", "playing", "gambling", "breathing", "squishing", "bluffing", "shooting"]
    nouns = ["humans", "donkeys", "puppies", "boulders", "crocodiles", "dinosaurs", "spectators", "amphibians", "kittens", "aliens"]

    return "".join([random.choice(words).title() for words in (adjectives, gerunds, nouns)])


class Player(BaseModel):
    __tablename__ = "players"

    name = db.Column(db.String(80), unique=False, nullable=False)
    balance = db.Column(db.Integer, nullable=False, default=500000)


class Table(BaseModel):
    __tablename__ = "tables"

    name = db.Column(db.String(80), unique=False, nullable=False, default=make_random_name)

    def __repr__(self):
        return "Table: {}".format(self.name)