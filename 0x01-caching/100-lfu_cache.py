#!/usr/bin/env python3
"""
module of a child class to a parent xaching system
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    caching model based on least frequency use LFU
    we track number of times keys are accessed in the cache and when the cache
    is full, we delete the one with the least number of access
    To achievw this:
    1. we set up a counter to count the number/frequency of access of keys
    2. we push the key with highest number of access to the end of a stack
    so that we get a stack that is a dict of keys with integers values in
    ascending order of their frequencies
    """
    def __init__(self):
        """
        initializing
        """
        super().__init__()
        self.stack = {}

    def put(self, key, item):
        """
        this method will update the value of existing keys and when the key
        does not exist creates
        a new item with the key
        """
        if key is None or item is None:
            return

        dictt = self.cache_data
        stack = self.stack

        dictt[key] = item

        if key not in stack.keys():
            stack[key] = 1
        else:
            stack[key] += 1

        if len(stack) > BaseCaching.MAX_ITEMS:
            discarded_key = min(stack, key=stack.get)
            print("DISCARD: {}".format(discarded_key))
            del dictt[discarded_key]
            del stack[discarded_key]

    def get(self, key):
        """
        get an item by the given key
        """
        dictt = self.cache_data
        stack = self.stack

        if key is None or key not in dictt.keys():
            return None

        stack[key] += 1

        return dictt[key]
