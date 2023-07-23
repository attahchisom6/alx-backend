#!/usr/bin/env python3
"""
script to get the first and last index of a page
"""
import math
import csv
from typing import Tuple, List


def index_range(page: int, page_size: int) -> Tuple:
    """
    Function to take 2 ibteger arguments

    Args:
        @page: (integer): the particular number of the page we are dealing with
        @page (integer): number of items per page
    Return: a 2-sized tuple with firt index and last index of items
    per each page
    """
    page -= 1
    first_idx = page * page_size
    last_idx = first_idx + page_size
    return first_idx, last_idx


class Server:
    """
    A class that populates a database with  data from popular baby names
    documentation
    """
    DATA_SET = "Popular_Baby_Names.csv"

    def __init__(self):
        """
        object factory
        """
        self.__dataset = None

    def dataset(self):
        """
        cached data
        """
        if self.__dataset is None:
            with open(DATA_SET) as f:
                data_list = csv.reader(f)
                dataset = [row for row in data_list]
            self.__dataset = dataset[1:]
        return self._dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        method to get a page, based on the page number and its size
        """
        if assert(page > 0, page_size > 0) is False:
            return []
        (x, y) = index_range(page, page_size)
        pages = dataset()

        for page in pages:
            if page[x] == page[0] and page[y] == page[-1]:
                return page
