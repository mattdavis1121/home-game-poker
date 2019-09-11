from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired, Email, EqualTo, Length

from models import User, Group


class RegisterGroupForm(FlaskForm):
    """Register a new Group."""

    name = StringField("Group Name", validators=[DataRequired(), Length(max=80)])

    def validate(self):
        """Validate form, ensuring group name is unique."""
        initial_validation = super(RegisterGroupForm, self).validate()
        if not initial_validation:
            return False
        group = Group.query.filter_by(name=self.name.data).first()
        if group:
            self.name.errors.append("Group with that name already exists")
            return False
        return True


class RegisterUserForm(FlaskForm):
    """Register a new User."""

    email = StringField("Email", validators=[DataRequired(), Email(), Length(min=6, max=40)])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=6, max=40)])
    confirm = PasswordField("Verify password", [DataRequired(), EqualTo("password", message="Passwords must match")],)

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super(RegisterUserForm, self).__init__(*args, **kwargs)
        self.user = None

    def validate(self):
        """Validate the form."""
        initial_validation = super(RegisterUserForm, self).validate()
        if not initial_validation:
            return False
        user = User.query.filter_by(email=self.email.data).first()
        if user:
            self.email.errors.append("Email already registered")
            return False
        return True


class LoginForm(FlaskForm):
    """Login form."""

    email = StringField("Email", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super(LoginForm, self).__init__(*args, **kwargs)
        self.user = None

    def validate(self):
        """Validate the form."""
        initial_validation = super(LoginForm, self).validate()
        if not initial_validation:
            return False

        # TODO: Shouldn't show users specifically what was wrong, email or pwd
        self.user = User.query.filter_by(email=self.email.data).first()
        if not self.user:
            self.email.errors.append("Unknown email")
            return False

        if not self.user.check_password(self.password.data):
            self.password.errors.append("Invalid password")
            return False

        if not self.user.active:
            self.username.errors.append("User not activated")
            return False
        return True
