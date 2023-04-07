from os import stat
import string    
import random # define the random module  
import os
from pathlib import Path

class BackendFX:
    @staticmethod
    def getUUID():
        S = 10  # number of characters in the string.  
        # call random.choices() string module to find the string in Uppercase + numeric data.  
        ran = ''.join(random.choices(string.ascii_letters, k = S))    
        return ran # print the random data  

    @staticmethod
    def getLinksFromDownloadList():
        with open('./downloadList.txt', 'r') as fin:
            links = fin.read().splitlines(True)
            return links

    @staticmethod
    #cwd steht fuer current working directory
    def getFirstFileInDirectory(directory):
        filepaths = os.listdir(directory)
        for filepath in filepaths:
            return filepath

    @staticmethod
    def getMusicFiles():
        file_directory = './static/music/'
        mp3_filepaths = []
        filepaths_long = []
        filepaths = os.listdir(file_directory)
        for filepath in filepaths:
            filepaths_long.append(file_directory + filepath)
        sorted_filepaths = sorted(filepaths_long, key=os.path.getmtime)

        # per default sind die files sortiert
        for filepath in sorted_filepaths:
            web_path = filepath[len(file_directory)::]
            if web_path[-4:] == '.mp3':
                mp3_filepaths.append(web_path)
        
        return mp3_filepaths

    @staticmethod
    def getCurrentlyDownloadingFiles():
        file_directory = './static/music/'
        currently_downloading_filepaths = []
        filepaths_long = []
        filepaths = os.listdir(file_directory)
        for filepath in filepaths:
            filepaths_long.append(file_directory + filepath)
        sorted_filepaths = sorted(filepaths_long, key=os.path.getmtime)

        # per default sind die files sortiert
        for filepath in sorted_filepaths:
            web_path = filepath[len(file_directory)::]
            if web_path[-5:] == '.part':
                currently_downloading_filepaths.append(web_path)
        
        return currently_downloading_filepaths

    @staticmethod
    # Python program to convert a list to string
    def listToString(s): 
        
        # initialize an empty string
        str1 = "" 
        
        # traverse in the string  
        for ele in s: 
            str1 += ele  
        
        # return string  
        return str1 