#!/usr/bin/env python3
"""
child module
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    a caching system, a child of BaseCachi g
    """

    MAX_ITEMS = float('inf')

    def __init__(self):
        """
        initializing
        """
        super().__init__()

    def put(self, key, item):
        """
        updates existing data if it exists else, it creates a new one
        in cache_data
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """
        return the value in the dictionary based on the key
        """
        if key is None or key not in self.cache_data.keys():
            return None
        return self.cache_data.get(key)
