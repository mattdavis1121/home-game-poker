from flask import render_template, redirect, url_for, Response, jsonify
from app import app, sse
from models import Table


@app.route("/")
def index():
    return "<h1>Hello, World!</h1>"


@app.route("/table/create/", methods=["POST", "GET"])
def create_table():
    table = Table()
    table.save()
    return redirect(url_for("show_table", table_name=table.name))


@app.route("/table/<table_name>/", methods=["GET"])
def show_table(table_name):
    table = Table.query.filter_by(name=table_name).first()
    return render_template("game.html")


@app.route("/button_clicked", methods=["GET"])
def button_clicked():
    sse.publish({"clicked": True}, type="event")
    return "Message sent!"
