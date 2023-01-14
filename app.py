import os

from flask import Flask, render_template, request, flash, redirect, session, g
import requests
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from models import db, connect_db, User
from forms import UserAddForm, LoginForm


CURR_USER_KEY = "curr_user"

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql:///capstone'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
toolbar = DebugToolbarExtension(app)

connect_db(app)

key = "16BU8NH1BF15DGXD"


@app.before_request
def add_user_to_g():
    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None


def do_logout():

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


def do_login(user):
    session[CURR_USER_KEY] = user.id

######################################################################
@app.route("/home")
def base():

    return render_template("/users/mainpage.html")


@app.route("/", methods=["GET", "POST"])
def signup():

    form = UserAddForm()
    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
                user_image=form.user_image.data or User.user_image.default.arg
            )
            db.session.commit()
        except IntegrityError:
            flash("Username already taken", "danger")
            return render_template('/users/signup.html', form=form)
        do_login(user)

        return redirect("/home")

    else:
        return render_template('/users/signup.html', form=form)


@app.route("/login", methods=["GET", "POST"])
def login():

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!" "success")
            return redirect("/")

    return render_template("/users/login.html", form=form)


@app.route("/logout")
def logout():
    do_logout()
    flash("logged out", "success")
    return redirect("/login")

    #########   main display   ##############################################


@app.route("/mainpage")
def main():

    return render_template("users/mainpage.html")


################## user routes #########################


@app.route("/users/<int:user_id>")
def show_user(user_id):
    user = User.query.get_or_404(user_id)

    return render_template("users/userdetail.html", user=user)


################## stock routes #######################
baseurl = 'https://www.alphavantage.co/query?function=OVERVIEW'


def get_stockdetails(symbol):
    res = requests.get(
        'https://www.alphavantage.co/query?function=OVERVIEW', params={'symbol': symbol, 'apikey': key})
    data = res.json()
    return data


@app.route("/stockdetails")
def index():

    symbol = request.args["stockinfo"]
    data = get_stockdetails(symbol)
    return render_template('stockinfo/stockdetail.html', data=data)
