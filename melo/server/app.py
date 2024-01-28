from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def say_melo():
  return "Melo"

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

if __name__ == '__main__':
    app.run(debug=True)