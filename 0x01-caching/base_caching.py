#!/usr/bin/python3
"""
Base Caching does the following
    * Base caching defines constants of your caching system where tour data are stoted
"""


class BaseCaching():
    """
    Base Caching class
    """
    MAX_ITEMS = 4

    def __init__(self):
        """
        initializing
        """
        self.cache_data = {}

    def print_cache(self):
        """
        print elements in the data cache
        """
        print("Current Cache:")
        for key in sorted(self.cache_data.keys()):
            print("{}: {}".format(key, self.cache_data[key]))

    def put(self, key, item):
        raise NotImplementedError("Put must be implemented in your cache class")

    def get(self, key):
        """
        get method
        """ 
        raise NotImplementedError("get must be implemented in your cache class")
