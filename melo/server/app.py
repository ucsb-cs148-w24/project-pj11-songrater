from flask import Flask, request, jsonify
from flask_cors import CORS
import discogs_client
import os
import psycopg2
import numpy as np

app = Flask(__name__)

CORS(app)
d = discogs_client.Client('melo/0.1', user_token='zqyCtqGCQpvbemuOmtNwjJtPImAgtAtcApcUsavp')
d_url = 'https://api.discogs.com/database/search'

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
    title = request.args.get("title")
    results = d.search(title, type='track')
    parsed_results = []
    for item in results.page(1):
       if isinstance(item, discogs_client.models.Release):
          release_title = item.title
          artist_name = ', '.join(artist.name for artist in item.artists)
          data = {
             'title': release_title,
             'artist': artist_name
          }
          parsed_results.append(data)
    response["results"] = parsed_results
  except Exception as e:
    response["MESSAGE"] = f"EXCEPTION: /title {e}"
    print(response["MESSAGE"])
  return jsonify(response)
  


# Creates a new user 
@app.route("/api/signup", methods=['POST'])
def create_user():
  response = {}
  
  # This function expects the following parameters: username (must be unique), email, and description (profile description)
  # Note that this POST method is boilerplate code for ANY POST FUNCTION
  try:
     # Just example code below
     uname = request.form.get("username")
     email = request.form.get("email")
     description = request.form.get("description")
     # Add these pieces of information to User postgres table
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
  # Note that this GET method is boilerplate code for ANY GET FUNCTION, can implement user login or some other GET functionality
  # using this basic template
  try:
     uname = request.args.get("username")
     # look up uname string in User postgres table, then return his profile info as a JSON string
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
  
  try:
     user_id = request.form.get("user_id")
     song_id = request.form.get("song_id")
     rank = request.form.get("rank")
     review = request.form.get("review")
     # add these pieces of information to user lists postgres table
     response["MESSAGE"] = "Successfully added new song to user list"
  except Exception as e:
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
     # look up user_id and song_id in user lists postgres table, then delete that row
  except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/delete_song {e}"
        print(response["MESSAGE"])
  return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
