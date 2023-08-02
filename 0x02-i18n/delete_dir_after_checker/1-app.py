#!/usr/bin/env python3
"""
module main frame our code into desired languages
"""
from flask import Flask, render_template
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


@app.route("/", methods=["GET"], strict_slashes=False)
def simple_page():
    """
    to interface with a html script to render a simple page
    """
    return render_template("1-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
