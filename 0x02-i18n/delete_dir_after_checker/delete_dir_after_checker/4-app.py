#!/usr/bin/env python3
"""
module main frame our code into desired languages
"""
from flask import Flask, render_template, request
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


@app.route("/", methods=["GET"], strict_slashes=False)
def simple_page():
    """
    to interface with a html script to render a simple page
    """
    return render_template("4-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
