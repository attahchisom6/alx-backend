#!/usr/bin/env python3
"""
module main frame our code into desired languages
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel


app = Flask(__name__)
babel = Babel(app)


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
    local_lang = request.args.get("locale")
    supported_languages = app.config["LANGUAGES"]
    if local_lang in supported_languages:
        return local_lang
    else:
        return request.accept_languages.best_match(supported_languages)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user():
    """
    return a user dictionary containing a user information
    """
    try:
        user_id = int(request.args.get("login_as"))
        return users.get(user_id)
    except Exception:
        return None

@app.before_request
def before_request():
    """
    will get a user using get user and set him as a
    global user
    """
    g.user = get_user()


@app.route("/", methods=["GET"], strict_slashes=False)
def simple_page():
    """
    to interface with a html script to render a simple page
    """
    return render_template("5-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
