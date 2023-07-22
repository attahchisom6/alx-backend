#!/usr/bin/env python3
"""
script to get the first and last index of a page
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple:
    """
    Function to take 2 ibteger arguments

    Args:
        @page: (integer): the particular number of the page we are dealing with
        @page (integer): number of items per page
    Return: a 2-size tuple with firt index abd last index of items per each page
    """
    page -= 1
    first_idx = page * page_size
    last_idx = first_idx + page_size
    return first_idx, last_idx
