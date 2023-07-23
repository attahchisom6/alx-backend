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
            with open(self.DATA_SET) as f:
                data_list = csv.reader(f)
                dataset = [row for row in data_list]
            self.__dataset = dataset[1:]
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List[str]]:
        """
        method to get a page, based on the page number and its size
        """
        assert type(page) == int and page > 0
        assert type(page_size) == int and page_size > 0

        (start_idx, end_idx) = index_range(page, page_size)
        pages = self.dataset()

        return pages[start_idx:end_idx]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> List[List[str]]:
        """
        This function will return a dictionary with these keys-value
        pair format
        page_size: no. of items in the page
        page: page_number
        data: dataset page
        next_page: next page number or None
        prev_page: previous pqge number or None
        total_pages: total number of pages in the dataset
        """
        len_db = len(self.dataset())

        page_obj = {
                "page_size": page_size,
                "page": page,
                "data": self.get_page(page, page_size),
                "next_page": None if page + 1 <= len_db else page + 1,
                "prev_page": None if page - 1 <= 0 else page - 1,
                "total_page": math.ceil(len_db / page_size)
            }
        return page_obj
