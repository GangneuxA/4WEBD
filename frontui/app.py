import datetime
import json
from flask import Flask, flash, redirect, render_template, request, url_for, session
import requests
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__)

app.secret_key = os.urandom(24)

URL = os.environ.get("URL")
HEADERS = {"accept": "*/*", "Content-Type": "application/json"}


@app.route("/")
def base():
    return redirect(url_for("home"))


@app.route("/home", methods=["GET", "POST"])
def home():
    if request.method == "GET":

        url = URL + "event"

        response = requests.get(url=url, headers=HEADERS)
        events = response.json()

        return render_template("home.html", events=events["events"])

    if request.method == "POST":
        try:
            if session["authenticated"]:
                event_id = request.form.get("event_id")

                return render_template("buy.html", event_id=event_id)
        except:
            return redirect(url_for("login"))


@app.route("/error")
def error():
    return render_template("error.html", utc_dt=datetime.datetime.utcnow())


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":

        url = URL + "login"
        body = {
            "email": request.form.get("email"),
            "password": request.form.get("password"),
        }

        response = requests.post(url=url, json=body, headers=HEADERS)

        if response.status_code == 200:
            session["access_token"] = response.json()["token"]
            session["email"] = response.json()["user"]["email"]
            session["role"] = response.json()["user"]["role"]
            session["id"] = response.json()["user"]["_id"]
            session["authenticated"] = True
            return redirect(url_for("home"))
        else:
            return redirect(url_for("error"))
    return render_template("login.html", utc_dt=datetime.datetime.utcnow())


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("home"))



@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        url = URL + "users"
        body = {
            "email": request.form.get("email"),
            "password": request.form.get("password"),
            "firstname": request.form.get("firstname"),
            "lastname": request.form.get("lastname"),
        }

        response = requests.post(url=url, json=body, headers=HEADERS)

        if response.status_code == 201:
            return redirect(url_for("login"))
        else:
            return redirect(url_for("error"))
    return render_template("register.html")


@app.route("/user", methods=["GET"])
def user():
    if request.method == "GET":
        try:
            if session["authenticated"]:
                url = URL + "users/" + str(session["id"])

                HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

                response = requests.get(url=url, headers=HEADERS)

                if response.status_code == 200:
                    print(response.json())
                    return render_template("user.html")
                else:
                    return redirect(url_for("error"))
        except:
            return render_template("login.html")


@app.route("/change_user", methods=["GET", "POST"])
def change_user():

    if request.method == "GET":
        return render_template("change_user.html")
    if request.method == "POST":

        body = {}
        body.update({"email": request.form.get("email")})
        body.update({"firstname": request.form.get("firstname")})
        body.update({"lastname": request.form.get("lastname")})
        if request.form.get("password") != None:
            body.update({"password": request.form.get("password")})
        url = URL + "users/"

        HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

        response = requests.put(url=url, json=body, headers=HEADERS)

        session["email"] = request.form.get("email")

        return redirect(url_for("user"))


@app.route("/delete_user", methods=["POST"])
def delete_user():
    if request.method == "POST":

        url = URL + "users"

        HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

        response = requests.delete(url=url, headers=HEADERS)
        session.clear()
        return redirect(url_for("home"))


@app.route("/administration", methods=["GET"])
def administration():
    if request.method == "GET":

        url = URL + "users"

        HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

        response = requests.get(url=url, headers=HEADERS)

        if response.status_code == 200:
            print(response.json())
            return render_template("administration.html", users=response.json())
        else:
            return redirect(url_for("error"))


@app.route("/buy", methods=["GET", "POST"])
def buy():
    if request.method == "POST":

        url = URL + "buy"

        body = {}
        body.update({"eventid": request.form.get("eventid")})
        body.update({"count": request.form.get("count")})

        HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

        response = requests.post(url=url, json=body, headers=HEADERS)

        return redirect(url_for("buy"))

    if request.method == "GET":
        try:
            if session["authenticated"] == True:
                url = URL + "buy/" + session["id"]

                HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

                response = requests.get(url=url, headers=HEADERS)

                if response.status_code == 200:
                    print(response.json())
                    return render_template(
                        "reservations.html", reservations=response.json()
                    )
                else:
                    return redirect(url_for("error"))
        except:
            return render_template("login.html")


@app.route("/admin_event", methods=["GET", "POST"])
def admin_event():
    if request.method == "GET":

        url = URL + "event"

        response = requests.get(url=url, headers=HEADERS)
        events = response.json()

        return render_template("Admin_events.html", events=events)


@app.route("/event", methods=["GET", "POST"])
def event():
    if request.method == "GET":
        return render_template("event.html")
    if request.method == "POST":

        url = URL + "event"

        HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

        body = {
            "name": request.form.get("name"),
            "desc": request.form.get("description"),
            "price": request.form.get("price"),
            "numberDispo": request.form.get("numberDispo"),
        }

        response = requests.post(url=url, json=body, headers=HEADERS)

        if response.status_code == 201:
            return redirect(url_for("admin_event"))
        else:
            return redirect(url_for("error"))


@app.route("/change_event", methods=["GET", "POST"])
def change_event():
    if request.method == "GET":
        return render_template(
            "change_event.html", event_id=request.args.get("event_id")
        )
    if request.method == "POST":

        url = URL + "event/" + request.form.get("event_id")

        HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

        body = {}
        if request.form.get("name") != "":
            body.update({"name": request.form.get("name")})
        if request.form.get("description") != "":
            body.update({"desc": request.form.get("description")})
        if request.form.get("price") != "":
            body.update({"price": request.form.get("price")})

        response = requests.put(url=url, json=body, headers=HEADERS)

        return redirect(url_for("admin_event"))


@app.route("/delete_event", methods=["POST"])
def delete_event():
    if request.method == "POST":

        url = URL + "event/" + request.form.get("event_id")

        HEADERS.update({"Authorization": "Bearer " + session["access_token"]})

        response = requests.delete(url=url, headers=HEADERS)

        return redirect(url_for("admin_event"))