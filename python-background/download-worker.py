# --------------------------
import os
import time
from BackendFX import BackendFX
import requests
import json
import shutil
from yt_dlp import YoutubeDL
from dotenv import load_dotenv

load_dotenv()

# change this if you change the target file's location
targetFolderRoot = './../express-server/public/'
tempFilesFolder = './_temp/'

fileNameFormat = '%(title)s.%(ext)s'

def download_json(foldername, link, song_id):
    print("Download JSON Called...")
    path_to_folder_of_downloaded_json = tempFilesFolder+foldername+'/music_info/'
    ytdl = YoutubeDL(
        {
            'outtmpl': path_to_folder_of_downloaded_json + fileNameFormat,
            'writeinfojson' : True,
            'skip_download': True,
            'noplaylist' : True,
        })

    with ytdl:
        try:
            ytdl.download([link])
            json_filename = BackendFX().getFirstFileInDirectory(path_to_folder_of_downloaded_json)

            # extract data from .json -> we want to know artist and album
            json_file = open(path_to_folder_of_downloaded_json + json_filename, 'r')
            values = json.load(json_file)
            json_file.close()

            # the info we need
            try:
                if (values['artist'] != ""):
                    artist = values['artist']
            except KeyError:
                try:
                    if (values['uploader'] != ""):
                        artist = values['uploader']
                except KeyError:
                    artist = "Unkown Artist"

            try:
                if (values['album'] != ""):
                    album = values['album']
            except KeyError:
                album = "Unknown Album"


            # i hope u like spagehtti xD
            try:
                if (values['title'] != ""):
                    title = values['title']
            except KeyError:
                try: 
                    if (values['alt_title'] != ""):
                        title = values['alt_title']
                except KeyError:
                    title = "Unknown Title"


            # update song info
            data = { 'artist' : artist, 'album': album, 'name': title ,'id': song_id}
            requests.post(os.getenv("EXPRESS_SERVER")+'updatedownloadedsong', data, verify=False)
        except:
            print("Something went wrong (JSON)")


def download_image(foldername, link, song_id):
    print("Download Image Called...")
    path_to_folder_of_downloaded_image = tempFilesFolder+foldername+'/music_thumbnails/'
    ytdl = YoutubeDL(
        {
            'outtmpl': path_to_folder_of_downloaded_image + fileNameFormat,
            'writethumbnail': True,
            'skip_download': True,
            'noplaylist' : True,
        })

    with ytdl:
        try:
            ytdl.download([link])
            image_filename = BackendFX().getFirstFileInDirectory(path_to_folder_of_downloaded_image)
            os.rename(path_to_folder_of_downloaded_image+"/"+image_filename, targetFolderRoot+"music_thumbnails/"+image_filename)

            # update image filename
            data = { 'image_filename' : image_filename, 'id': song_id}
            requests.post(os.getenv("EXPRESS_SERVER") + 'updatedownloadedsong', data, verify=False)
        except:
            print("Something went wrong (Image)")

    

def download_audio(foldername, link, song_id):
    print("Download Audio Called...")
    path_to_folder_of_downloaded_audio = tempFilesFolder+foldername+'/music/'
    ytdl = YoutubeDL(
        {
            'outtmpl': path_to_folder_of_downloaded_audio + fileNameFormat,
            'format': 'bestaudio/best',
            'writethumbnail': False,
            'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
            }],
        })

    with ytdl:
        try:
            ytdl.download([link])
            music_filename = BackendFX().getFirstFileInDirectory(path_to_folder_of_downloaded_audio)
            os.rename(path_to_folder_of_downloaded_audio+music_filename, targetFolderRoot+"music/"+music_filename)
            
            #update filename
            data = { 'filename' : music_filename, 'id': song_id}
            requests.post(os.getenv("EXPRESS_SERVER") + 'updatedownloadedsong', data, verify=False)
        except Exception as e:
            print("Something went wrong (Audio)")
            print(e)


def download_service(): 
    print("Download Service Called...")
    try: 
        url = os.getenv("EXPRESS_SERVER") + 'getsongtodownload'
        print(url)
        r = requests.get(url, verify=False)

        if (r.json() != "0"):
            download_instructions = r.json()
            print(download_instructions)
            song_id = str(download_instructions["id"])
            folder_name = "download_" + song_id
            download_link = download_instructions["link"]
            download_image(folder_name, download_link, song_id)
            download_audio(folder_name, download_link, song_id)
            download_json(folder_name, download_link, song_id)
        else:
            print("Kein Song zu downloaden")
    except:
        print("Etwas hat nicht funktioniert")

# loop for changes in the download list
while True:
    download_service()
    time.sleep(1)