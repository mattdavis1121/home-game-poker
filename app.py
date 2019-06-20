from flask import Flask

from extensions import db, migrate, sse, login_manager, bcrypt


def create_app(config_object="settings"):
    """Create application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.
    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split(".")[0])
    app.config.from_object(config_object)
    register_extensions(app)
    app.register_blueprint(sse, url_prefix="/stream")
    return app


def register_extensions(app):
    """Register Flask extensions."""
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)


app = create_app()

# Needs to import after app creation to avoid circular import errors
from views import *
from models import *
