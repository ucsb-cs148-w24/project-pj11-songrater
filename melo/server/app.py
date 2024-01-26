from flask import Flask, request, jsonify
import discogs_client

app = Flask(__name__)
d = discogs_client.Client('melo/0.1', user_token='zqyCtqGCQpvbemuOmtNwjJtPImAgtAtcApcUsavp')
d_url = 'https://api.discogs.com/database/search'

@app.route("/")
def melo():
  return "Melo"

# http://localhost:5000/title?title='X'
@app.route("/title", methods=['GET'])
def get_title():
  results = d.search('Hello', type='track')
  print(results)
  return "done"
