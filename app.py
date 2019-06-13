from flask import Flask

from extensions import db, migrate


def create_app(config_object="settings"):
    """Create application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.
    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split(".")[0])
    app.config.from_object(config_object)
    register_extensions(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    db.init_app(app)
    migrate.init_app(app, db)


app = create_app()

# Needs to import after app creation to avoid circular import errors
from views import *
from models import *
