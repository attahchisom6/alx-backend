#!/usr/bin/env python3
"""
A child class module of a cache system BaseCaching
"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """
    The is an MRU model. here each time we update or add a new key to our
    dict, we move the key to the end of a stack. if dict/cache is full, we
    delete the most recently accessed key which is in the end of the
    stack
    Update: since the key already exists we remove it from the stack and
    append ro the end of the stack
    Add: since rhe key doesnt exist we append it to the end
    """
    def __init__(self):
        """
        initializing
        """
        super().__init__()
        self.stack = []

    def put(self, key, item):
        """
        this method ensures that if the key already exist, it is updated, else
        a new item is created with rhe key
        """
        if key is None or item is None:
            return

        dictt = self.cache_data
        stack = self.stack

        # dictt[key] = item

        if key in dictt:
            stack.remove(key)

        elif len(dictt) >= BaseCaching.MAX_ITEMS:
            discarded_key = stack.pop()
            print("DISCARD: {}".format(discarded_key))
            del dictt[discarded_key]

        dictt[key] = item
        stack.append(key)

    def get(self, key):
        """
        get a value associated with a given key
        """
        dictt = self.cache_data

        if key is None or key not in dictt.keys():
            return None
        # each time a key is accessed  by the get method, the key is appended
        # to the end of the list

        self.stack.remove(key)
        self.stack.append(key)
        return dictt[key]
