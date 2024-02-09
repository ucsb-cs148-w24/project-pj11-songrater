from flask import Flask, request, jsonify
from flask_cors import CORS
import discogs_client
import os
import psycopg2
app = Flask(__name__)

CORS(app)
d = discogs_client.Client('melo/0.1', user_token='zqyCtqGCQpvbemuOmtNwjJtPImAgtAtcApcUsavp')
d_url = 'https://api.discogs.com/database/search'

#To make the connection, you have to export your personal postgres username and password
#export DB_USERNAME="postgres"
#export DB_PASSWORD="your_passwork"

def get_db_connection():
  conn = psycopg2.connect(host='localhost',
                          database='music_db',
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

# Finished skeleton endpoints for user song list feature below by connecting with DB - Katya 

#  Adds a new song to a user's list
@app.route("/api/add_song", methods=['POST'])
def add_song():
    response = {}
    try:
        # retrieve data from the request
        user_id = request.form.get("user_id")
        song_id = request.form.get("song_id")
        rank = int(request.form.get("rank"))  # Convert rank to integer
        review = request.form.get("review")
        
        # determine the table based on rank
        if 0 <= rank < 4:
            table_name = "User_Lists_Bad"
        elif 4 <= rank < 7:
            table_name = "User_Lists_Ok"
        else:  # rank is between 7 and 10
            table_name = "User_Lists_Good"
        
        # establish a connection to the database
        conn = get_db_connection()
        cur = conn.cursor()
        
        # dynamically insert the new song into the determined table
        cur.execute(f"INSERT INTO public.\"{table_name}\" (user_id, song_id, rank, review) VALUES (%s, %s, %s, %s)",
                    (user_id, song_id, rank, review))
        
        # commit the transaction to make the change permanent
        conn.commit()
        
        # close the cursor and connection to free resources
        cur.close()
        conn.close()
        
        response["MESSAGE"] = f"Successfully added new song to {table_name}"
    except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/add_song {e}"
        print(response["MESSAGE"])
    return jsonify(response)


# Retrieves a user's song list
@app.route("/api/get_user_songs", methods=['GET'])
def get_user_songs():
    response = {}
    try:
        user_id = request.args.get("user_id")
        
        # establish a connection to the database
        conn = get_db_connection()
        cur = conn.cursor()
        
        # initialize an empty list to hold all songs
        all_songs = []
        
        # iterate over each table and append results
        for table_name in ["User_Lists_Good", "User_Lists_Ok", "User_Lists_Bad"]:
            cur.execute(f"SELECT song_id, rank, review FROM public.\"{table_name}\" WHERE user_id = %s", (user_id,))
            songs = cur.fetchall()
            all_songs.extend(songs)
        
        # close the cursor and connection to free resources
        cur.close()
        conn.close()
        
        # format the response with the retrieved songs
        response["songs"] = [{"song_id": song[0], "rank": song[1], "review": song[2]} for song in all_songs]
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
        new_rank = int(request.args.get("new_rank"))  # Convert new_rank to integer
        new_review = request.args.get("new_review")
        
        # determine the table based on new_rank
        if 0 <= new_rank < 4:
            table_name = "User_Lists_Bad"
        elif 4 <= new_rank < 7:
            table_name = "User_Lists_Ok"
        else:  # new_rank is between 7 and 10
            table_name = "User_Lists_Good"
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # dynamically update the song in the determined table
        cur.execute(f"UPDATE public.\"{table_name}\" SET rank = %s, review = %s WHERE user_id = %s AND song_id = %s",
                    (new_rank, new_review, user_id, song_id))
        conn.commit()
        cur.close()
        conn.close()
        
        response["MESSAGE"] = "Successfully updated song in user list"
    except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/update_song {e}"
        print(response["MESSAGE"])
    return jsonify(response)


#  Deletes a song from a user's list.
@app.route("/api/delete_song", methods=['DELETE'])
def delete_song():
    response = {}
    try:
        # retrieve user_id, song_id, and rank from the request
        user_id = request.args.get("user_id")
        song_id = request.args.get("song_id")
        rank = int(request.args.get("rank"))  # Assuming rank is passed as a query parameter and converting it to integer

        # establish a connection to the database
        conn = get_db_connection()
        cur = conn.cursor()
        
        # determine the table based on rank
        if 0 <= rank < 4:
            table_name = "User_Lists_Bad"
        elif 4 <= rank < 7:
            table_name = "User_Lists_Ok"
        else:  # rank is between 7 and 10
            table_name = "User_Lists_Good"
        
        # delete the specified song for the user from the determined table
        cur.execute(f"DELETE FROM public.\"{table_name}\" WHERE user_id = %s AND song_id = %s", (user_id, song_id))
        
        # commit the transaction to make the change permanent
        conn.commit()
        
        # close the cursor and connection to free resources
        cur.close()
        conn.close()
        
        response["MESSAGE"] = f"Successfully deleted song from {table_name}"
    except Exception as e:
        response["MESSAGE"] = f"EXCEPTION: /api/delete_song {e}"
        print(response["MESSAGE"])
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
