# Project-pj11-songrater README
Project Name: Melo 

Project description: A platform to rate albums / songs you've listened to and compare / share it with friends. 

__Group Members__ \
Jeffrey Mun: @jumshim \
Amy Wang: @awaang \
Emily Hu: @oomily \
Aryaman Das: @akdas16 \
Collin Qian: @collinq \
Leyang Ni: @LeyangNi \
Katyayani Raman: @humwooter 


__Tech Stack__ \
Frontend: React Native through Expo Go \
Backend: Flask Server w/ PostgreSQL database 

__User Roles__

Our song rater app has two kinds of users: One is the general user browsing/ranking songs, and the other is the artist who releases their songs/albums.

Users can do the following:
1. Perform basic CRUD operations (add themselves as a user in the app, delete their profile, etc.)
2. Users can rank a song, which will then be added to their music (listening) history
3. Users can look up user profiles of their friends, and rank their songs too (seeing their music tastes as well as your own)
4. For later: Users can get recommendations of new songs based on their current music tastes

Artist can do the following:
1. See how their music is doing (which songs have been viewed the most, ranked the highest, etc.)

# Installation
__Prerequisite__

1. latest version of `npm` and `node`
2. Python 3.0
3. Expo

__Installing Packages / Dependencies__
*Within Melo Folder*

Ensure you're on the latest version of `npm` and `node`, and run `npm install`

`cd` into the `/server` folder and `pip3 / pip install` the following packages:
- flask
- flask_cors
- psycopg2
- numpy
- requests

__Installation Steps__

1. cd into '/server' folder
2. run the app.py
3. follow the steps on Expo to run the demo


# Functionality

1. 


# Known Problems



__Initializing the Database__

To initialize the database, cd into the db folder, then run these 2 commands:
1. psql -U postgres -a -f musicdb.sql
2. psql -U postgres -d musicdb -a -f tables.sql

"postgres" can be changed to your prefered username.

Then, to connect the database to the flask, your postgres username and passwords have to be exported. To do so, run:
1. export DB_USERNAME="postgres"
2. export DB_PASSWORD="password"

But with your username and password.


