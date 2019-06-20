from flask import render_template, redirect, url_for, request
from flask_login import login_required, login_user, logout_user, current_user

from app import app, sse
from models import Table, User
from forms import RegisterForm, LoginForm
from extensions import login_manager


@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    return User.query.get(int(user_id))


@app.route("/")
def index():
    if current_user.is_authenticated:
        return redirect(url_for("tables"))
    else:
        return redirect(url_for("login"))


@app.route("/login/", methods=["POST", "GET"])
def login():
    form = LoginForm(request.form)
    if form.validate_on_submit():
        login_user(form.user)
        redirect_url = request.args.get('next') or url_for("tables")
        return redirect(redirect_url)
    return render_template("login.html", form=form)


@app.route("/logout/")
@login_required
def logout():
    """Logout."""
    logout_user()
    return redirect(url_for("index"))


@app.route("/register/", methods=["POST", "GET"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        new_user = User.create(
            email=form.email.data,
            password=form.password.data,
            username=form.email.data,
            active=True
        )
        login_user(new_user)
        redirect_url = request.args.get('next') or url_for("tables")
        return redirect(redirect_url)
    return render_template("register.html", form=form)


@app.route("/tables/", methods=["POST", "GET"])
@login_required
def tables():
    if request.method == "POST":
        table = Table()
        table.save()
        return redirect(url_for("show_table", table_name=table.name))
    else:
        records = Table.query.all()
        return render_template("index.html", tables=records)


@app.route("/tables/<table_name>/", methods=["GET"])
@login_required
def show_table(table_name):
    table = Table.query.filter_by(name=table_name).first()
    return render_template("game.html", table=table)


@app.route("/button_clicked", methods=["POST"])
@login_required
def button_clicked():
    data = request.get_json()
    table = Table.query.filter_by(name=data["tableName"]).first()
    sse.publish({"clicked": True}, type="event", channel=table.name)
    return "Message sent!"
