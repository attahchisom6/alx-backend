#!/usr/bin/env python3
"""
module main frame our code into desired languages
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel, format_datetime
import pytz


app = Flask(__name__)
babel = Babel(app)
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config:
    """
    Class to define the languages our code uses
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


# apply configuration/attribute to app instance usig Concog class
app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """
    get the local language most suitable for an occassion
    """
    supported_languages = app.config["LANGUAGES"]

    # Locale from URL parameters
    if request.args.get("locale"):
        local_lang = request.args.get("locale")
        if local_lang in supported_languages:
            return local_lang

    # Locale from user settings
    if g.user:
        local_lang = g.user.get("locale")
        if local_lang in supported_languages:
            return local_lang

    # Locale from request header
    if request.headers.get("locale"):
        local_lang = request.headers.get("locale")
        if local_lang in supported_languages:
            return local_lang
    return request.accept_languages.best_match(supported_languages)


def get_user(has_id):
    """
    return a user dictionary containing a user information
    """
    if has_id is None:
        return None

    for user_id, user_info in users.items():
        if user_id == int(has_id):
            return user_info
    return None


@app.before_request
def before_request():
    """
    will get a user using get user and set him as a
    global user
    """
    has_id = request.args.get("login_as")
    user = get_user(has_id)
    g.user = user
    g.time = format_datetime()


@babel.timezoneselector
def get_timezone():
    """
    select the best time zone based on users choice
    """
    # find time zone parameters in url parameters
    if request.args.get('timezone'):
        local_tZone = request.args.get("timezone")
        if local_tZone in pytz.all_timezones:
            return local_tZone
        else:
            raise pytz.exceptions.UnknownTimeZoneError

    # find rime zone from user setting
    if g.user:
        local_tZone = g.user.get("timezone")
        if local_tZone in pytz.all_timezones:
            return local_tZone
        else:
            raise pytz.exceptions.UnknownTimeZoneError
    else:
        return app.config["BABEL_DEFAULT_TIMEZONE"]


@app.route("/", methods=["GET"], strict_slashes=False)
def simple_page():
    """
    to interface with a html script to render a simple page
    """
    return render_template("7-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
