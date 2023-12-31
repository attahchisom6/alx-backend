#!/usr/bin/env python3
"""
script to get the first and last index of a page
"""
import math
import csv
from typing import Tuple, List, Dict


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
        self.__indexed_dataset = None

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

    def indexed_dataset(self) -> Dict[int, List]:
        """
        dataset indexed by sorting position starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                    k: dataset[k] for k in range(len(dataset))
                }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        these method is designed to return a dictionary with the following
        key-value pair format
        index: curr_start_idx current starting index of the return page
        next_index: next_start_idx starting index of the next page, it also
        the ending index of the<F11>  urrent page
        page_size: the current page size
        data: The actual page of the dataset
        """
        assert type(index) == int and type(page_size) == int
        assert 0 <= index < len(self.indexed_dataset())

        dictt = self.indexed_dataset()
        next_index = index + page_size

        # this block will serve to handle the case of delected rows
        pages = []
        for k in range(index, next_index):
            if not dictt.get(k):
                k += 1
                next_index += 1
            pages.append(dictt.get(k))

        object_dict = {
                "index": index,
                "data": pages,
                "page": page_size,
                "next_index": next_index
            }
        return object_dict
