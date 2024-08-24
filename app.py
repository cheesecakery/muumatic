from flask import Flask, render_template, session, request
import git
import requests

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

auth_manager = SpotifyClientCredentials()
spotify = spotipy.Spotify(client_credentials_manager=auth_manager)

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        if 'searchAnything' in request.form:
            # Get search result
            search = request.form.get("searchAnything")
            if search == "":
                return render_template("index.html") 

            # Get the results & return track dictionary
            results = spotify.search(q=search, limit=49, offset=0, type='track', market=None)['tracks']['items']
            if (len(results) == 0):
                return render_template("index.html", apology="no tracks found !")

            tracks = makeTrackObjects(results)

            return render_template("index.html", search=search, tracks=tracks)

        elif 'searchPlaylist' in request.form:
            # Get search result
            search = request.form.get("searchPlaylist")
            if search == "":
                return render_template("index.html")

            # get just id by removing start of url
            playlist_id = search.removeprefix("https://open.spotify.com/playlist/")
            # try to get the playlist, if not a valid playlist, return nothing.
            try:
                playlist = spotify.playlist(playlist_id)
            except:
                return render_template("index.html", apology="not a valid playlist url !")

            # get just the track from the 'tracks' dict of playlist
            results = [track['track'] for track in playlist['tracks']['items']]
            tracks = makeTrackObjects(results)

            return render_template("index.html", search=str(playlist['name']), tracks=tracks)
        else:
            # Get search result
            search = request.form.get("searchArtist")

            # find first artist who matches search
            artists = spotify.search(q=search, limit=49, offset=0, type='artist', market=None)['artists']['items']
            if len(artists) > 0:
                artist = artists[0]
                artist_id = artist['id']
                                
                # search for top results under this artist
                results = spotify.search(q=f"artist:{artist['name']}", limit=49, offset=0, type='track', market=None)['tracks']['items']
                tracks = makeTrackObjects(results)
                return render_template("index.html", search=str(artist['name']), tracks=tracks)
            else:
                return render_template("index.html", apology="no matching artists !")
    else:
        genres = spotify.recommendation_genre_seeds()
        return render_template("index.html") 


# takes track ids and gets out relevant info to make the sketch :)
def makeTrackObjects(results):
    # Gets just the id of the track
    track_ids = [str(result['id']) for result in results]
    # track_analysi = [spotify.audio_analysis(id)["track"] for id in track_ids]
    # Gets qualities based on track
    track_qualities = spotify.audio_features(track_ids)

    # Loop through and create dictionary of relevant attributes
    tracks = []
    for i in range(len(track_ids)):
        if (track_qualities[i] is not None):
            track = {
                "name":results[i]['name'],
                "artist":results[i]['artists'][0]['name'],
                "loudness":track_qualities[i]['loudness'],
                "valence":track_qualities[i]['valence'],
                "energy":track_qualities[i]['energy'],
                "tempo":track_qualities[i]['tempo'],
                "duration":track_qualities[i]['duration_ms'],
                "danceability":track_qualities[i]['danceability']
            }
            tracks.append(track)

    return tracks
