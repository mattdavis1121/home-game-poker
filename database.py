from datetime import datetime as dt
from extensions import db


class MetaData:
    id = db.Column(db.Integer, primary_key=True)
    created_utc = db.Column(db.DateTime, nullable=False, default=dt.utcnow)
    modified_utc = db.Column(db.DateTime, nullable=False, default=dt.utcnow)


class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD (create, read, update, delete) operations."""

    @classmethod
    def create(cls, **kwargs):
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        return instance.save()

    def update(self, commit=True, **kwargs):
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return commit and self.save() or self

    def save(self, commit=True):
        """Save the record."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit=True):
        """Remove the record from the database."""
        db.session.delete(self)
        return commit and db.session.commit()


class BaseModel(CRUDMixin, MetaData, db.Model):
    __abstract__ = True
