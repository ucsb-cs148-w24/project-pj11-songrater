from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import psycopg2
import numpy as np
import requests

app = Flask(__name__)

CORS(app)
music_brainz_url = "https://musicbrainz.org/ws/2"

#To make the connection, you have to export your personal postgres username and password
#export DB_USERNAME="postgres"
#export DB_PASSWORD="your_passwork"

def get_db_connection():
  conn = psycopg2.connect(host='localhost',
                          database='musicdb',
                          user=os.environ['DB_USERNAME'],
                          password=os.environ['DB_PASSWORD'])
  return conn

@app.route("/title", methods=["GET"])
def find_by_title():
  response = {}

  # This function expects the following parameters: title
  # This GET request receives the Discogs_API information for a requested title

  try:
    title = request.args.get("title", "")
    artist = request.args.get("artist", "")
    artist_encoded = requests.utils.quote(artist)
    title_encoded = requests.utils.quote(title)
    query_url = f"{music_brainz_url}/recording/?query=recording:\"{title_encoded}\" AND artist:\"{artist_encoded}\"&fmt=json"
    response = {}
    query = requests.get(query_url).json()
    unique_tracks = {}
    compiled_data = []

    for index, recording in enumerate(query["recordings"]):
       artist_name = recording["artist-credit"][0]["name"]
       title = recording["title"]
       mbid = recording["id"]

       unique_key = f"{artist_name}-{title}"
       if unique_key not in unique_tracks:
          unique_tracks[unique_key] = True
          compiled_data.append({
             "artist": artist_name,
             "title": title,
             "mbid": mbid,
          })
    response["results"] = compiled_data
  except Exception as e:
    response["MESSAGE"] = f"EXCEPTION: /title {e}"
    print(response["MESSAGE"])
  return jsonify(response)
  


# Creates a new user 
@app.route("/api/signup", methods=['POST'])
def create_user():
  response = {}
  
  # This function takes email as a parameter and returns back to the frontend email, username (unique), and description
  # A new user will be added to db with these fields and the frontend should save this information as variables for currently
  # logged in user

  try:
     email = request.args.get("email")
     conn = get_db_connection()
     cur = conn.cursor()

     at_sign_idx = email.index('@')
     username = email[:at_sign_idx]
     description = 'Hi my name is ' + username + '.'

     cur.execute("INSERT INTO \"User\" (username, email, description) VALUES (%s, %s, %s)", 
                       (username, email, description))
     conn.commit()

     final_result = []
     new_user_profile = {'username': username, 'email': email, 'description': description}
     final_result.append(new_user_profile)

     response["results"] = final_result     

     response["MESSAGE"] = "Successfully created new user and added to db"
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/signup {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Retrieves a user's profile information.
@app.route("/api/get_profile", methods=['GET'])
def get_profile():
  response = {}
  
  # This function should return back to the user his profile info
  
  try:
     uname = request.args.get("uname")
     conn = get_db_connection()
     cur = conn.cursor()

     sql_query = f"SELECT * FROM \"User\" WHERE username = '{uname}';"
     cur.execute(sql_query)
     user_profile = cur.fetchall()

     final_result = []

     for profile in user_profile:
        data = {'id': profile[0], 'username': profile[1], 'email': profile[2], 'description': profile[3]}
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
  
  # This function should allow the user to change any part of his profile, including username
  # Note that this PUT method is boilerplate code to implement any UPDATE functionality
  try:
     old_uname = request.args.get("old_name")
     new_uname = request.args.get("new_name")
     new_email = request.args.get("email")
     new_description = request.args.get("description")
     # look up old_uname string in User postgres table for the correct User entry, then update that row
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/update_profile {e}"
        print(response["MESSAGE"])
  return jsonify(response)

# Deletes a user.
@app.route("/api/delete_user", methods=['DELETE'])
def delete_user():
  response = {}
  
  # This function should delete user and his information from the app
  # Note that this DELETE method is boilerplate code to implement any DELETE functionality
  try:
     uname = request.args.get("username")
     # look up uname string in User postgres table, then delete that row
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
     s_id = int(song_id)

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
                       (uid, s_id, rank_int, review))
           conn.commit()

        elif rank_int >= 1 and rank_int <= num_rows:
           for i in range(num_rows):
              if (i+1) >= rank_int:
                 curr_rank = good_songs[i][2]
                 update_query = f"UPDATE \"User_Lists_Good\" SET rank = {curr_rank+1} WHERE user_id = {good_songs[i][0]} AND song_id = {good_songs[i][1]};"
                 cur.execute(update_query)
                 conn.commit()
           cur.execute("INSERT INTO \"User_Lists_Good\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, s_id, rank_int, review))
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
                       (uid, s_id, rank_int, review))
           conn.commit()

        elif rank_int >= 1 and rank_int <= num_rows:
           for i in range(num_rows):
              if (i+1) >= rank_int:
                 curr_rank = ok_songs[i][2]
                 update_query = f"UPDATE \"User_Lists_Ok\" SET rank = {curr_rank+1} WHERE user_id = {ok_songs[i][0]} AND song_id = {ok_songs[i][1]};"
                 cur.execute(update_query)
                 conn.commit()
           cur.execute("INSERT INTO \"User_Lists_Ok\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, s_id, rank_int, review))
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
                       (uid, s_id, rank_int, review))
           conn.commit()

        elif rank_int >= 1 and rank_int <= num_rows:
           for i in range(num_rows):
              if (i+1) >= rank_int:
                 curr_rank = bad_songs[i][2]
                 update_query = f"UPDATE \"User_Lists_Bad\" SET rank = {curr_rank+1} WHERE user_id = {bad_songs[i][0]} AND song_id = {bad_songs[i][1]};"
                 cur.execute(update_query)
                 conn.commit()
           cur.execute("INSERT INTO \"User_Lists_Bad\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)", 
                       (uid, s_id, rank_int, review))
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
        sql_query = f"SELECT * FROM \"User_Lists_Good\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        good_songs = cur.fetchall()
        num_rows = int(cur.rowcount)

        if num_rows == 0:
           response["MESSAGE"] = "No songs to display here"
           return jsonify(response)
        
        final_result = []

        rating_list = np.linspace(7.0, 10.0, num=num_rows)
        idx = rating_list.size-1

        for song in good_songs:
           data = {'user_id': song[0], 'song_id': song[1], 'rank': song[2], 'review': song[3], 'rating': rating_list[idx]}
           final_result.append(data)
           idx = idx-1
        
        response["results"] = final_result
           
      
     elif type == "ok":
        sql_query = f"SELECT * FROM \"User_Lists_Ok\" WHERE user_id = {user_id} ORDER BY rank;"
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
           data = {'user_id': song[0], 'song_id': song[1], 'rank': song[2], 'review': song[3], 'rating': rating_list[idx]}
           final_result.append(data)
           idx = idx-1

        response["results"] = final_result

     else:
        sql_query = f"SELECT * FROM \"User_Lists_Bad\" WHERE user_id = {user_id} ORDER BY rank;"
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
           data = {'user_id': song[0], 'song_id': song[1], 'rank': song[2], 'review': song[3], 'rating': rating_list[idx]}
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

     check_good = f"SELECT * FROM \"User_Lists_Good\" WHERE user_id = {user_id} AND song_id = {song_id};"
     cur.execute(check_good)
     good_exists = cur.fetchall()

     if len(good_exists) != 0:
        response["MESSAGE"] = "You have already ranked this song. Please choose a new song to rank."
        return jsonify(response)

     check_ok = f"SELECT * FROM \"User_Lists_Ok\" WHERE user_id = {user_id} AND song_id = {song_id};"
     cur.execute(check_ok)
     ok_exists = cur.fetchall()

     if len(ok_exists) != 0:
        response["MESSAGE"] = "You have already ranked this song. Please choose a new song to rank."
        return jsonify(response)
     
     check_bad = f"SELECT * FROM \"User_Lists_Bad\" WHERE user_id = {user_id} AND song_id = {song_id};"
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

# Updates a song entry in a user's list.
@app.route("/api/update_song", methods=['PUT'])
def update_song():
  response = {}
  
  try:
     user_id = request.args.get("user_id")
     song_id = request.args.get("song_id")
     new_rank = request.args.get("new_rank")
     new_review = request.args.get("new_review")
     # look up user_id and song_id in user lists postgres table, then update the rank and review

     # Add a success message to the response
     response["MESSAGE"] = "Successfully updated song"
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/update_song {e}"
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

     s_id = int(song_id)

     if type == "good":
        sql_query = f"SELECT * FROM \"User_Lists_Good\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        good_songs = cur.fetchall()
        
        for song in reversed(good_songs):
           if song[1] == s_id:
              del_query = f"DELETE FROM \"User_Lists_Good\" WHERE user_id = {song[0]} AND song_id = {song[1]};"
              cur.execute(del_query)
              conn.commit()
              break
           
           curr_rank = song[2]
           update_query = f"UPDATE \"User_Lists_Good\" SET rank = {curr_rank-1} WHERE user_id = {song[0]} AND song_id = {song[1]};"
           cur.execute(update_query)
           conn.commit()
     
     elif type == "ok":
        sql_query = f"SELECT * FROM \"User_Lists_Ok\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        ok_songs = cur.fetchall()
        
        for song in reversed(ok_songs):
           if song[1] == s_id:
              del_query = f"DELETE FROM \"User_Lists_Ok\" WHERE user_id = {song[0]} AND song_id = {song[1]};"
              cur.execute(del_query)
              conn.commit()
              break
           
           curr_rank = song[2]
           update_query = f"UPDATE \"User_Lists_Ok\" SET rank = {curr_rank-1} WHERE user_id = {song[0]} AND song_id = {song[1]};"
           cur.execute(update_query)
           conn.commit()
     
     else:
        sql_query = f"SELECT * FROM \"User_Lists_Bad\" WHERE user_id = {user_id} ORDER BY rank;"
        cur.execute(sql_query)
        bad_songs = cur.fetchall()
        
        for song in reversed(bad_songs):
           if song[1] == s_id:
              del_query = f"DELETE FROM \"User_Lists_Bad\" WHERE user_id = {song[0]} AND song_id = {song[1]};"
              cur.execute(del_query)
              conn.commit()
              break
           
           curr_rank = song[2]
           update_query = f"UPDATE \"User_Lists_Bad\" SET rank = {curr_rank-1} WHERE user_id = {song[0]} AND song_id = {song[1]};"
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


if __name__ == '__main__':
    app.run(debug=True)