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

1. Search a song by name and add it
2. Evaluate the song with three choices: "Good", "Ok", "Bad"
3. Leave a comment for this song
4. Compare this song with other songs in the same category ("Good", "Ok", "Bad")
5. Get the rank of the song and its score! 


# Known Problems

1. Need to update database settings 


# Others

__Installing the Database__

To install postgres db, you can download from the official website appropriate for your OS, or if you are a MAC user, you can run the following commands:
1. brew install postgresql
2. brew services start postgresql  # to start the db
3. brew services stop postgresql   # to stop the db
   
__Initializing the Database__

To initialize the database, you first need to create a user role where you can have permissions for creating a db, creating tables, etc. Run the following commands:
1. psql postgres
2. Then inside of the psql client, run CREATE ROLE "username" CREATEDB LOGIN PASSWORD "password";
3. Once you have created the user role (with username and password), save those credentials for later. You can also list all user roles with \du inside of psql client

Exit out of psql client with \q, cd into the db folder, then inside of musicdb.sql file, replace this line "OWNER = adas16" with your own username (from create role). In tables.sql file, you will see these same "OWNER = " lines as well. Replace them with your username.
Then, while still inside of db folder, run these 2 commands:
1. psql postgres -U "username" -a -f musicdb.sql
2. psql postgres -U "username" -d musicdb -a -f tables.sql

"username" should be replaced with your username.

Then, to connect the database from your flask server, your postgres username and passwords have to be exported. To do so, run:
1. export DB_USERNAME="postgres"
2. export DB_PASSWORD="password"

But with your username and password.

__Interacting with the Database__

Though you can use psql client and interact with postgres db from command line, we would recommend PGAdmin, a UI interface for interacting with the database. To get that set up, do the following:
1. Go to  https://www.pgadmin.org/ and download the PGAdmin client for your OS
2. Provide the following credentials for setting up your database server: host -> "localhost", user -> "username", password -> "password", maintenance database –> “postgres”
3. Once everything is set up, you should be able to view all databases, tables you created inside each of them, any indexes created, and perform SQL queries on these tables. You will see nicely formatted tabular output when you execute SQL SELECT queries, which is really cool.



