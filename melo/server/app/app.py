from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import psycopg2
import numpy as np
import requests
from concurrent.futures import ThreadPoolExecutor
import datetime

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins" : "http://localhost:8081"}})
music_brainz_url = "https://musicbrainz.org/ws/2"
cover_art_url = "http://coverartarchive.org/release"

#To make the connection, you have to export your personal postgres username and password
#export DB_USERNAME="postgres"
#export DB_PASSWORD="your_passwork"
def get_db_connection():
  conn = psycopg2.connect(host='melo-db.cl42gyco25t3.us-east-2.rds.amazonaws.com',
                          database='melo-db',
                          user='postgres',
                          password='wi2ceITIK4Boa08XgQyU')
  return conn

def parse_date(date_str):
    """
    Parses a date string that may not always be in the same format.
    Most are in %Y-%m-%d, but some may be just %Y.
    """
    for fmt in ('%Y-%m-%d', '%Y', '%Y-%m'):
        try:
            return datetime.datetime.strptime(date_str, fmt)
        except ValueError:
            pass
    raise ValueError(f"Date format for '{date_str}' is not supported.")

def allowed_recording(recording):
   if 'disambiguation' in recording:
      if recording['disambiguation'] == 'explicit':
         return True
      elif recording['disambiguation'] == 'acoustic':
         return True
      return False
   if 'first-release-date' not in recording:
      return False
   return True

def find_image_url(release_mbid):
    """
    Fetches the image URL for a given MusicBrainz release MBID.
    """
    try:
        response = requests.get(f"{cover_art_url}/{release_mbid}")
        if response.status_code != 200:  # Raises an error for 4XX/5XX responses
           return ''
        cover_art_data = response.json()
        if 'images' in cover_art_data and len(cover_art_data['images']) > 0:
            return cover_art_data['images'][0]['image']
    except Exception as e:
        print(f"Error fetching cover art for MBID {release_mbid}: {e}")
    return ""

def fetch_image_url(recording):
    """
    Wrapper function for find_image_url to use with ThreadPoolExecutor.
    Expects a recording dict, extracts the release MBID, and fetches the image URL.
    """
    if 'releases' in recording and allowed_recording(recording):
        release_mbid = recording['releases'][0]['id']
        return find_image_url(release_mbid)
    return ""

@app.route("/title", methods=["GET"])
def find_by_title():
   response = {}
   try:
      title = request.args.get("title")
      artist = request.args.get("artist")

      if (title is None and artist is not None) or (title is not None and artist is None) or (title is None and artist is None):
         response["MESSAGE"] = "artist name and title both need to be specified"
         return jsonify(response)
      
      conn = get_db_connection()
      cur = conn.cursor()

      sql_query = f"SELECT * FROM \"Song_Info\" WHERE artist_name ILIKE '%{artist}%' AND song_name ILIKE '%{title}%';"
      cur.execute(sql_query)
      search_results = cur.fetchall()
      num_rows = int(cur.rowcount)

      if num_rows > 0:
         final_result = []

         for res in search_results:
            data = {'artist': res[2], 'title': res[1], 'mbid': res[0], 'image': res[3], 'release_date': res[4]}
            final_result.append(data)
        
         response["results"] = final_result
         return jsonify(response)
      
      artist_encoded = requests.utils.quote(artist)
      title_encoded = requests.utils.quote(title)
      query_url = f"{music_brainz_url}/recording/?query=recording:\"{title_encoded}\" AND artist:\"{artist_encoded}\"&fmt=json"
      recordings_response = requests.get(query_url)
      recordings_response.raise_for_status()  # Ensure we got a successful response
      recordings_data = recordings_response.json()
      # Use ThreadPoolExecutor to fetch image URLs in parallel
      with ThreadPoolExecutor() as executor:
          future_to_recording = {executor.submit(fetch_image_url, recording): recording for recording in recordings_data.get("recordings", [])}
          for future in future_to_recording:
              recording = future_to_recording[future]
              try:
                  image_url = future.result()
                  recording['image_url'] = image_url  # Add image URL directly to the recording dict
              except Exception as e:
                  print(f"Error fetching image URL: {e}")
      compiled_data = []
      unique_tracks = {}
      for recording in recordings_data.get("recordings", []):
          artist_name = recording["artist-credit"][0]["name"]
          title = recording["title"]
          mbid = recording["id"]
          unique_key = f"{artist_name}-{title}"
          if allowed_recording(recording):
              release_date = parse_date(recording['first-release-date'])
              if unique_key not in unique_tracks:
                  compiled_data.append({
                      "artist": artist_name,
                      "title": title,
                      "mbid": mbid,
                      "image": recording['image_url'],
                      "release_date": release_date,
                  })
                  unique_tracks[unique_key] = release_date
              else:
                  # Check if this release date is earlier, and update if it is
                  if release_date < unique_tracks[unique_key]:
                      for item in compiled_data:
                          if item["artist"] == artist_name and item["title"] == title:
                              item["image"] = recording['image_url']
                              item["release_date"] = release_date
                              unique_tracks[unique_key] = release_date
                              break
      
      for item in compiled_data:
         cur.execute("INSERT INTO \"Song_Info\" (song_id, song_name, artist_name, cover, release_date) VALUES (%s, %s, %s, %s, %s)", 
                       (item["mbid"], item["title"], item["artist"], item["image"], item["release_date"]))
         conn.commit()
      
      cur.close()
      conn.close()

      response["results"] = compiled_data
   except Exception as e:
      response["MESSAGE"] = f"EXCEPTION: /title {e}"
      print(response["MESSAGE"])

   return jsonify(response)
  


# Creates a new user 
@app.route("/api/signup", methods=['POST'])
def create_user():
  response = {}
  
  # This function takes uid and email as a parameters and returns back to the frontend the full profile information for newly created user
  # A new user will be added to db with these fields and the frontend should save this information as variables for currently
  # logged in user

  try:
     uid = request.args.get("uid")
     email = request.args.get("email")
     conn = get_db_connection()
     cur = conn.cursor()

     at_sign_idx = email.index('@')
     username = email[:at_sign_idx]
     description = 'Hi my name is ' + username + '.'

     cur.execute("INSERT INTO \"User\" (username, email, description, uid) VALUES (%s, %s, %s, %s)", 
                       (username, email, description, uid))
     conn.commit()

     final_result = []
     new_user_profile = {'username': username, 'uid': uid, 'email': email, 'description': description}
     final_result.append(new_user_profile)

     response["results"] = final_result

     cur.close()
     conn.close()     

     response["MESSAGE"] = "Successfully created new user and added to db"
     print(username,email)
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/signup {e}"
        print("ERROR: \n" + response["MESSAGE"] + "\n")
  return jsonify(response)

# Retrieves a user's profile information.
@app.route("/api/get_profile", methods=['GET'])
def get_profile():
  response = {}
  
  # This function should return back to the user his profile info
  
  try:
     uid = request.args.get("uid")
     conn = get_db_connection()
     cur = conn.cursor()

     sql_query = f"SELECT * FROM \"User\" WHERE uid = '{uid}';"
     cur.execute(sql_query)
     user_profile = cur.fetchall()

     final_result = []

     for profile in user_profile:
        data = {'id': profile[0], 'username': profile[1], 'email': profile[2], 'description': profile[3], 'uid': profile[4]}
        final_result.append(data)
        
     response["results"] = final_result
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "Successfully retrieved profile of user"
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/get_profile {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Updates a user's profile.
@app.route("/api/update_profile", methods=['PUT'])
def update_profile():
  response = {}
  
  # This function should allow the user to change his username and/or his profile description
  # Note that this PUT method is boilerplate code to implement any UPDATE functionality
  try:
     user_id = request.args.get("user_id")
     new_uname = request.args.get("uname")
     new_description = request.args.get("description")

     conn = get_db_connection()
     cur = conn.cursor()

     sql_query = f"SELECT * FROM \"User\" WHERE username = '{new_uname}';"
     cur.execute(sql_query)
     user_exists = cur.fetchall()
     num_rows = int(cur.rowcount)

     if num_rows > 0:
        response["MESSAGE"] = "Sorry this username is already taken. Please try again."
        return jsonify(response)
     
     update_query = f"UPDATE \"User\" SET username = '{new_uname}', description = '{new_description}' WHERE id = {user_id};"
     cur.execute(update_query)
     conn.commit()

     final_result = []
     data = {'id': int(user_id), 'username': new_uname, 'description': new_description}
     final_result.append(data)
        
     response["results"] = final_result
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "Successfully updated profile of user"
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/update_profile {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Deletes a user.
@app.route("/api/delete_user", methods=['DELETE'])
def delete_user():
  response = {}
  
  # This function should delete user and his information from the app (user song list info and friend list info)
  # Note that this DELETE method is boilerplate code to implement any DELETE functionality
  try:
     user_id = request.args.get("user_id")
     conn = get_db_connection()
     cur = conn.cursor()

     # Delete user information in Friend table
     del_friend_query1 = f"DELETE FROM \"Friend\" WHERE uid1 = {user_id};"
     cur.execute(del_friend_query1)
     conn.commit()

     del_friend_query2 = f"DELETE FROM \"Friend\" WHERE uid2 = {user_id};"
     cur.execute(del_friend_query2)
     conn.commit()

     # Delete user information in all three user song list tables

     del_song_list_query1 = f"DELETE FROM \"User_Lists_Good\" WHERE user_id = {user_id};"
     cur.execute(del_song_list_query1)
     conn.commit()

     del_song_list_query2 = f"DELETE FROM \"User_Lists_Ok\" WHERE user_id = {user_id};"
     cur.execute(del_song_list_query2)
     conn.commit()

     del_song_list_query3 = f"DELETE FROM \"User_Lists_Bad\" WHERE user_id = {user_id};"
     cur.execute(del_song_list_query3)
     conn.commit()

     # And finally, delete user from User table!

     del_user_query = f"DELETE FROM \"User\" WHERE id = {user_id};"
     cur.execute(del_user_query)
     conn.commit()
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "Successfully deleted user and his information from the app!"

  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/delete_user {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Added new skeleton endpoints for user song list feature below - Katya 

#  Adds a new song to a user's list
@app.route("/api/add_song", methods=['POST'])
def add_song():
  response = {}
  valid_rank_val = True

  try:
     user_id = request.args.get("user_id")
     song_id = request.args.get("song_id")
     rank = request.args.get("rank")
     review = request.args.get("review")
     type = request.args.get("type")
    
     rank_int = int(rank)
     uid = int(user_id)

     conn = get_db_connection()
     cur = conn.cursor()

     if type == "good":
        sql_query = f"SELECT * FROM \"User_Lists_Good\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        good_songs = cur.fetchall()
        num_rows = int(cur.rowcount)

        if rank_int > num_rows+1 or rank_int < 1:
           response["MESSAGE"] = "rank must be a valid integer between 1 and num_songs_in_list+1"
           return jsonify(response)
        elif rank_int == num_rows+1:
           cur.execute("INSERT INTO \"User_Lists_Good\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, song_id, rank_int, review))
           conn.commit()

        elif rank_int >= 1 and rank_int <= num_rows:
           for i in range(num_rows):
              if (i+1) >= rank_int:
                 curr_rank = good_songs[i][2]
                 update_query = f"UPDATE \"User_Lists_Good\" SET rank = {curr_rank+1} WHERE user_id = {good_songs[i][0]} AND song_id = '{good_songs[i][1]}';"
                 cur.execute(update_query)
                 conn.commit()
           cur.execute("INSERT INTO \"User_Lists_Good\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, song_id, rank_int, review))
           conn.commit()
      
    
     elif type == "ok":
        sql_query = f"SELECT * FROM \"User_Lists_Ok\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        ok_songs = cur.fetchall()
        num_rows = int(cur.rowcount)

        if rank_int > num_rows+1 or rank_int < 1:
           response["MESSAGE"] = "rank must be a valid integer between 1 and num_songs_in_list+1"
           return jsonify(response)
        elif rank_int == num_rows+1:
           cur.execute("INSERT INTO \"User_Lists_Ok\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, song_id, rank_int, review))
           conn.commit()

        elif rank_int >= 1 and rank_int <= num_rows:
           for i in range(num_rows):
              if (i+1) >= rank_int:
                 curr_rank = ok_songs[i][2]
                 update_query = f"UPDATE \"User_Lists_Ok\" SET rank = {curr_rank+1} WHERE user_id = {ok_songs[i][0]} AND song_id = '{ok_songs[i][1]}';"
                 cur.execute(update_query)
                 conn.commit()
           cur.execute("INSERT INTO \"User_Lists_Ok\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, song_id, rank_int, review))
           conn.commit()
      

     else:
        sql_query = f"SELECT * FROM \"User_Lists_Bad\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        bad_songs = cur.fetchall()
        num_rows = int(cur.rowcount)

        if rank_int > num_rows+1 or rank_int < 1:
           response["MESSAGE"] = "rank must be a valid integer between 1 and num_songs_in_list+1"
           return jsonify(response)
        elif rank_int == num_rows+1:
           cur.execute("INSERT INTO \"User_Lists_Bad\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, song_id, rank_int, review))
           conn.commit()

        elif rank_int >= 1 and rank_int <= num_rows:
           for i in range(num_rows):
              if (i+1) >= rank_int:
                 curr_rank = bad_songs[i][2]
                 update_query = f"UPDATE \"User_Lists_Bad\" SET rank = {curr_rank+1} WHERE user_id = {bad_songs[i][0]} AND song_id = '{bad_songs[i][1]}';"
                 cur.execute(update_query)
                 conn.commit()
           cur.execute("INSERT INTO \"User_Lists_Bad\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, song_id, rank_int, review))
           conn.commit()
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "Successfully added new song to user list"
  except Exception as e:
        valid_rank_val = False
        if valid_rank_val is not True:
          response["MESSAGE"] = "rank must be a valid integer between 1 and num_songs_in_list+1"
        response["MESSAGE"] = f"EXCEPTION: /api/add_song {e}"
        print(response["MESSAGE"])
  return jsonify(response)



# Retrieves a user's song list given his user id and song type preference
@app.route("/api/get_user_songs", methods=['GET'])
def get_user_songs_by_type():
  response = {}
  
  # type is a string with one of three values: "good", "ok", "bad"
  # make sure that when making this GET call, the type string is spelled properly with one of the three values shown above
  # Example GET call: "http://127.0.0.1:5000/api/get_user_songs?user_id=${user_id}&type=${type}"
  # Use the GET call above (same exact syntax) in the frontend

  # This function retrieves all songs for a particular user id given his song type preference
  # Also calculates the rating list from the rankings and returns everything as a JSON string

  try:
     user_id = request.args.get("user_id")
     type = request.args.get("type") 
     conn = get_db_connection()
     cur = conn.cursor()     

     if type == "good":
        sql_query = f"SELECT \"User_Lists_Good\".song_id,\"User_Lists_Good\".rank,\"User_Lists_Good\".review,\"Song_Info\".song_name,\"Song_Info\".artist_name,\"Song_Info\".release_date FROM \"User_Lists_Good\" INNER JOIN \"Song_Info\" ON \"User_Lists_Good\".song_id = \"Song_Info\".song_id WHERE \"User_Lists_Good\".user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        good_songs = cur.fetchall()
        num_rows = int(cur.rowcount)
        print(f"good_songs: {good_songs}")

        if num_rows == 0:
           response["MESSAGE"] = "No songs to display here"
           return jsonify(response)
        
        final_result = []

        rating_list = np.linspace(7.0, 10.0, num=num_rows)
        idx = rating_list.size-1

        for song in good_songs:
           data = {'song_id': song[0], 'rank': song[1], 'review': song[2], 'song_name': song[3], 'artist_name': song[4], 'release_date': song[5], 'rating': rating_list[idx]}
           final_result.append(data)
           idx = idx-1
        
        response["results"] = final_result
           
      
     elif type == "ok":
        sql_query = f"SELECT \"User_Lists_Ok\".song_id,\"User_Lists_Ok\".rank,\"User_Lists_Ok\".review,\"Song_Info\".song_name,\"Song_Info\".artist_name,\"Song_Info\".release_date FROM \"User_Lists_Ok\" INNER JOIN \"Song_Info\" ON \"User_Lists_Ok\".song_id = \"Song_Info\".song_id WHERE \"User_Lists_Ok\".user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        ok_songs = cur.fetchall()
        num_rows = int(cur.rowcount)

        if num_rows == 0:
           response["MESSAGE"] = "No songs to display here"
           return jsonify(response)
        
        final_result = []

        rating_list = np.linspace(4.0, 7.0, num=num_rows, endpoint=False)
        idx = rating_list.size-1

        for song in ok_songs:
           data = {'song_id': song[0], 'rank': song[1], 'review': song[2], 'song_name': song[3], 'artist_name': song[4], 'release_date': song[5], 'rating': rating_list[idx]}
           final_result.append(data)
           idx = idx-1

        response["results"] = final_result

     else:
        sql_query = f"SELECT \"User_Lists_Bad\".song_id,\"User_Lists_Bad\".rank,\"User_Lists_Bad\".review,\"Song_Info\".song_name,\"Song_Info\".artist_name,\"Song_Info\".release_date FROM \"User_Lists_Bad\" INNER JOIN \"Song_Info\" ON \"User_Lists_Bad\".song_id = \"Song_Info\".song_id WHERE \"User_Lists_Bad\".user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        bad_songs = cur.fetchall()
        num_rows = int(cur.rowcount)

        if num_rows == 0:
           response["MESSAGE"] = "No songs to display here"
           return jsonify(response)
        
        final_result = []

        rating_list = np.linspace(0.0, 4.0, num=num_rows, endpoint=False)
        idx = rating_list.size-1

        for song in bad_songs:
           data = {'song_id': song[0], 'rank': song[1], 'review': song[2], 'song_name': song[3], 'artist_name': song[4], 'release_date': song[5], 'rating': rating_list[idx]}
           final_result.append(data)
           idx = idx-1

        response["results"] = final_result
      
     cur.close()
     conn.close()
    
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/get_user_songs {e}"
        print(response["MESSAGE"])
  return jsonify(response)

@app.route("/api/song_exists", methods=['GET'])
def song_exists():
  response = {}
  
  # Given user id and song id, check to see if the song exists in any of the three user list tables
  # This is an important check to avoid adding the same song twice in any table
  
  try:
     user_id = request.args.get("user_id")
     song_id = request.args.get("song_id")
     conn = get_db_connection()
     cur = conn.cursor()

     check_good = f"SELECT * FROM \"User_Lists_Good\" WHERE user_id = {user_id} AND song_id = '{song_id}';"
     cur.execute(check_good)
     good_exists = cur.fetchall()

     if len(good_exists) != 0:
        response["MESSAGE"] = "You have already ranked this song. Please choose a new song to rank."
        return jsonify(response)

     check_ok = f"SELECT * FROM \"User_Lists_Ok\" WHERE user_id = {user_id} AND song_id = '{song_id}';"
     cur.execute(check_ok)
     ok_exists = cur.fetchall()

     if len(ok_exists) != 0:
        response["MESSAGE"] = "You have already ranked this song. Please choose a new song to rank."
        return jsonify(response)
     
     check_bad = f"SELECT * FROM \"User_Lists_Bad\" WHERE user_id = {user_id} AND song_id = '{song_id}';"
     cur.execute(check_bad)
     bad_exists = cur.fetchall()

     if len(bad_exists) != 0:
        response["MESSAGE"] = "You have already ranked this song. Please choose a new song to rank."
        return jsonify(response)
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "You have not ranked this song."
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/get_profile {e}"
        print(response["MESSAGE"])
  return jsonify(response)

#  Deletes a song from a user's list.
@app.route("/api/delete_song", methods=['DELETE'])
def delete_song():
  response = {}
  
  try:
     user_id = request.args.get("user_id")
     song_id = request.args.get("song_id")
     type = request.args.get("type") 
     conn = get_db_connection()
     cur = conn.cursor()

     if type == "good":
        sql_query = f"SELECT * FROM \"User_Lists_Good\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        good_songs = cur.fetchall()
        
        for song in reversed(good_songs):
           if song[1] == song_id:
              del_query = f"DELETE FROM \"User_Lists_Good\" WHERE user_id = {song[0]} AND song_id = '{song[1]}';"
              cur.execute(del_query)
              conn.commit()
              break
           
           curr_rank = song[2]
           update_query = f"UPDATE \"User_Lists_Good\" SET rank = {curr_rank-1} WHERE user_id = {song[0]} AND song_id = '{song[1]}';"
           cur.execute(update_query)
           conn.commit()
     
     elif type == "ok":
        sql_query = f"SELECT * FROM \"User_Lists_Ok\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        ok_songs = cur.fetchall()
        
        for song in reversed(ok_songs):
           if song[1] == song_id:
              del_query = f"DELETE FROM \"User_Lists_Ok\" WHERE user_id = {song[0]} AND song_id = '{song[1]}';"
              cur.execute(del_query)
              conn.commit()
              break
           
           curr_rank = song[2]
           update_query = f"UPDATE \"User_Lists_Ok\" SET rank = {curr_rank-1} WHERE user_id = {song[0]} AND song_id = '{song[1]}';"
           cur.execute(update_query)
           conn.commit()
     
     else:
        sql_query = f"SELECT * FROM \"User_Lists_Bad\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        bad_songs = cur.fetchall()
        
        for song in reversed(bad_songs):
           if song[1] == song_id:
              del_query = f"DELETE FROM \"User_Lists_Bad\" WHERE user_id = {song[0]} AND song_id = '{song[1]}';"
              cur.execute(del_query)
              conn.commit()
              break
           
           curr_rank = song[2]
           update_query = f"UPDATE \"User_Lists_Bad\" SET rank = {curr_rank-1} WHERE user_id = {song[0]} AND song_id = '{song[1]}';"
           cur.execute(update_query)
           conn.commit()
     
     cur.close()
     conn.close()

     # Add a success message to the response
     response["MESSAGE"] = "Successfully deleted song from user list"
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/delete_song {e}"
        print(response["MESSAGE"])
  return jsonify(response)


# Endpoint to search for new friends
@app.route("/api/friends_all", methods=['GET'])
def search_friends_all():
  response = {}
  
  # For friend search criteria (all): should display all Users
  
  try:
     user_id = request.args.get("user_id")
     conn = get_db_connection()
     cur = conn.cursor()

     sql_query = f"SELECT * FROM \"User\" WHERE id <> {user_id};"
     cur.execute(sql_query)
     users_info = cur.fetchall()
     num_rows = int(cur.rowcount)

     if num_rows == 0:
        response["MESSAGE"] = "Sorry you can't add any friends at this time. Please try again later."
        return jsonify(response)

     final_result = []

     for user_info in users_info:
        data = {'id': user_info[0], 'username': user_info[1], 'email': user_info[2], 'description': user_info[3]}
        final_result.append(data)
        
     response["results"] = final_result
     
     cur.close()
     conn.close()
     
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/friends_all {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Endpoint to search for new friends (by username)
@app.route("/api/friends_specific", methods=['GET'])
def search_friends_specific():
  response = {}
  
  # For friend search criteria (specific): should only display User profile that was searched up
  
  try:
     user_id = request.args.get("user_id")
     uname = request.args.get("uname")
     conn = get_db_connection()
     cur = conn.cursor()
     uid = int(user_id)

     sql_query = f"SELECT * FROM \"User\" WHERE username = '{uname}';"
     cur.execute(sql_query)
     users_info = cur.fetchall()
     num_rows = int(cur.rowcount)

     if num_rows == 0:
        response["MESSAGE"] = "Sorry this username doesn't exist. Please try again."
        return jsonify(response)

     final_result = []

     for user_info in users_info:
        if uid == int(user_info[0]):
           response["MESSAGE"] = "You can't add yourself as a friend. Please choose a different username."
           return jsonify(response)
        else:
           data = {'id': user_info[0], 'username': user_info[1], 'email': user_info[2], 'description': user_info[3]}
           final_result.append(data)
        
     response["results"] = final_result
     
     cur.close()
     conn.close()
     
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/friends_specific {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Add a friend
@app.route("/api/add_friend", methods=['POST'])
def add_friend():
  response = {}
  
  # This function should add a new friend to user friend list
  
  try:
     user_id = request.args.get("user_id")
     fid = request.args.get("fid")
     conn = get_db_connection()
     cur = conn.cursor()

     cur.execute("INSERT INTO \"Friend\" (uid1, uid2) VALUES (%s, %s)", 
                       (user_id, fid))
     conn.commit()

     # assuming friends are bidirectional relationships (like Facebook)

     cur.execute("INSERT INTO \"Friend\" (uid1, uid2) VALUES (%s, %s)", 
                       (fid, user_id))
     conn.commit()
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "Successfully added friend to user friend list"
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/add_friend {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# This endpoint ensures that you avoid adding a friend twice in user friend list
@app.route("/api/friend_exists", methods=['GET'])
def friend_exists():
  response = {}
    
  try:
     user_id = request.args.get("user_id")
     fid = request.args.get("fid")
     conn = get_db_connection()
     cur = conn.cursor()

     friend_exists_query = f"SELECT * FROM \"Friend\" WHERE uid1 = {user_id} AND uid2 = {fid};"
     cur.execute(friend_exists_query)
     f_exists = cur.fetchall()

     if len(f_exists) != 0:
        response["MESSAGE"] = "You have already added him/her as friend in your list. Please try again."
        return jsonify(response)
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "You can add him/her as a friend."
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/friend_exists {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# This endpoint retrieves a user's friend list
@app.route("/api/get_friends", methods=['GET'])
def get_friends():
  response = {}
    
  try:
     user_id = request.args.get("user_id")
     conn = get_db_connection()
     cur = conn.cursor()

     friends_list_query = f"SELECT \"Friend\".uid2,\"User\".username,\"User\".email,\"User\".description FROM \"Friend\" INNER JOIN \"User\" ON \"Friend\".uid2 = \"User\".id WHERE \"Friend\".uid1 = {user_id};"
     cur.execute(friends_list_query)
     f_list = cur.fetchall()
     num_rows = int(cur.rowcount)

     if num_rows == 0:
        response["MESSAGE"] = "No friends to display here"
        return jsonify(response)
        
     final_result = []
  
     for friend in f_list:
         data = {'id': friend[0], 'username': friend[1], 'email': friend[2], 'description': friend[3]}
         final_result.append(data)
        
     response["results"] = final_result
     
     cur.close()
     conn.close()
     
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/get_friends {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Delete a friend
@app.route("/api/delete_friend", methods=['DELETE'])
def delete_friend():
  response = {}
  
  # This function should delete a friend from user friend list
  
  try:
     user_id = request.args.get("user_id")
     fid = request.args.get("fid")
     conn = get_db_connection()
     cur = conn.cursor()

     del_query = f"DELETE FROM \"Friend\" WHERE uid1 = {user_id} AND uid2 = {fid};"
     cur.execute(del_query)
     conn.commit()

     # delete friend the other way!

     del_query2 = f"DELETE FROM \"Friend\" WHERE uid1 = {fid} AND uid2 = {user_id};"
     cur.execute(del_query2)
     conn.commit()
     
     cur.close()
     conn.close()
     
     response["MESSAGE"] = "Successfully deleted friend from user friend list"
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/delete_friend {e}"
        print(response["MESSAGE"])
  return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)

@app.route("/api/friends_top_songs", methods=['GET'])
def get_friends_top_songs():
   response = {}
   try:
      user_id = request.args.get("user_id")
      if not user_id:
         raise ValueError("user_id is required")

      # set default value for top_k if not provided or invalid
      try:
         top_k = int(request.args.get("top_k", "10"))
      except ValueError:
         raise ValueError("top_k must be an integer") from None

      conn = get_db_connection()
      cur = conn.cursor()

      sql_query = """
      WITH friend_ids AS (
         SELECT uid2 AS friend_id FROM public."Friend" WHERE uid1 = %s
         UNION
         SELECT uid1 AS friend_id FROM public."Friend" WHERE uid2 = %s
      )
      SELECT s.song_id, s.song_name, s.artist_name, ul.rank, u.username AS friend_name
      FROM friend_ids
      JOIN public."User_Lists_Good" ul ON friend_ids.friend_id = ul.user_id
      JOIN public."Song_Info" s ON ul.song_id = s.song_id
      JOIN public."User" u ON friend_ids.friend_id = u.id
      ORDER BY ul.updated_at DESC
      LIMIT %s;
      """

      cur.execute(sql_query, (user_id, user_id, top_k))
      songs = cur.fetchall()

      if not songs:
         return jsonify({"MESSAGE": "No songs found"}), 404

      songs_list = [{"song_id": song[0], "song_name": song[1], "artist_name": song[2], "rank": song[3], "friend_name": song[4]} for song in songs]
      response["top_songs"] = songs_list
      
      cur.close()
      conn.close()
   except ValueError as ve:
      response["MESSAGE"] = str(ve)
      return jsonify(response), 400
   except Exception as e:
      response["MESSAGE"] = f"EXCEPTION: /api/friends_top_songs {e}"
      print(response["MESSAGE"])
      return jsonify(response), 500
   return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
