from flask import render_template, redirect, url_for, request
from app import app, sse
from models import Table


@app.route("/")
def index():
    return redirect(url_for("tables"))


@app.route("/tables/", methods=["POST", "GET"])
def tables():
    if request.method == "POST":
        table = Table()
        table.save()
        return redirect(url_for("show_table", table_name=table.name))
    else:
        records = Table.query.all()
        return render_template("index.html", tables=records)


@app.route("/tables/<table_name>/", methods=["GET"])
def show_table(table_name):
    table = Table.query.filter_by(name=table_name).first()
    return render_template("game.html", table=table)


@app.route("/button_clicked", methods=["POST"])
def button_clicked():
    data = request.get_json()
    table = Table.query.filter_by(name=data["tableName"]).first()
    sse.publish({"clicked": True}, type="event", channel=table.name)
    return "Message sent!"
