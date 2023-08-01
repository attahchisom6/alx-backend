#!/usr/bin/env python3
"""
basic flask app
"""
from flask import Flask, render_template


app = Flask(__name__)


@app.route("/", strict_slashes=False)
def Greeting():
    """
    return a greeting string
    """
    greeting = "Welcome to Holberton"
    header = "Hello world"
    return render_template("0-index.html", greeting=greeting, header=header)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
