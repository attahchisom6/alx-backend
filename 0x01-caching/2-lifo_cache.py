#!/usr/bin/env python3
"""
A child class Module
"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    A caxhing system based on the LIFO model, the last to enter the stack
    will also be the first to be deleted
    """
    def __init__(self):
        """
        initializing
        """
        super().__init__()

    def put(self, key, item):
        """
        put method to update data if it wzists or create it if it doesnt
        """
        dictt = self.cache_data

        if key is None or item is None:
            return

        dictt[key] = item

        if len(dictt) > BaseCaching.MAX_ITEMS:
            list_dict = list(dictt.keys())
            discarded_key = list_dict[-1]
            print("DISCARD: {}".format(discarded_key))
            del dictt[discarded_key]

    def get(self, key):
        """
        get value associated with the key
        """
        dictt = self.cache_data
        if key is None or key not in dictt.keys():
            return None
        return dictt[key]&
