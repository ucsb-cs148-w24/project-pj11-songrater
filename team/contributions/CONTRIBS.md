# Team Contributions

This file documents the roles and GitHub contributions of each team member for our project.

## Team Roles

### Katya
- Role: Backend developer and tester.

### Jeffrey
- Role: Full-stack developer, mainly on frontend

### Emily
- Role: 

### Leyang
- Role: 

### Aryaman
- Role: Backend developer

### Colin
- Role:

### Amy
- Role: 

## GitHub Contributions

### Katya
- Developed Flask endpoints responsible for editing the user song list, getting user song list, adding songs, etc.
- Developed low-level tests for our Flask endpoints as well as higher-level BDD tests

### Jeffrey
- Connected API to get titles from Musicbrainz
- Created functions to fetch cover arts
- Created Rate song and Search song screens
- Created ranking algorithm

### Emily


### Leyang


### Aryaman
- Made most of my code contributions in app.py file, which basically contains code for our Flask endpoints
- Brainstormed and implemented all the basic CRUD endpoints needed for our application, specifically concerning those for User, user song lists, and user friend lists. Example: signup (POST), get_user_songs (GET), delete_friend (DELETE), friends_specific (GET) are just some of the endpoints I worked on
- Contributed to the /title endpoint, which basically returns a list of song search results queried by artist name and song title. Jeffrey worked on the part to fetch these results from Musicbrainz API, but I worked on the part to add these song results to the Song_Info db table so that for similar query searches we don't have to keep calling the API (basically caching the search results into db for faster retrieval in future queries)
- Made some changes to tables.sql file to reflect some of the changes that I proposed should be made to our postgres db table schemas (like removing a few column field headers from Song_Info table or changing the type of some fields)


### Colin


### Amy


Please note that this file will be updated regularly as our project progresses and contributions evolve.
