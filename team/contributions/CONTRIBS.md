# Team Contributions

This file documents the roles and GitHub contributions of each team member for our project.

## Team Roles

### Katya

- Role: Backend developer and tester.

### Jeffrey

- Role: Full-stack developer, mainly on frontend

### Emily

- Role: Frontend and database set up

### Leyang

- Role: Database set up and Frontend

### Aryaman

- Role: Backend developer

### Colin

- Role: Frontend Developer

### Amy

- Role: Frontend developer

## GitHub Contributions

### Katya

- Developed Flask endpoints responsible for editing the user song list, getting user song list, adding songs, etc.
- Developed low-level tests for our Flask endpoints as well as higher-level BDD tests

### Jeffrey

- Connected API to get titles from Musicbrainz
- Established components / framework to be used throughout the app (structure of a full-stack interaction with http requests, shared typography / design styles, etc...) 
- Created functions to fetch cover arts
- Created Rate song and Search song screens
- Created ranking algorithm
- Main full-stack lead in connecting backend w/ frontend
- Acted as point of contact for team members to reach out if they needed help with frontend, full-stack, or debugging work. 

### Emily

- With Leyang, created the sql scripts for making our database and tables.
- Also with Leyang, deployed the database to aws rds.
- Created the profile page and the page to allow users to edit their information.

### Leyang

- With Emily, created the sql scripts for making database and tables.
- Deployed the database to aws rds with Emily
- With Collin, created the friends page that allow users to add new friend and view their friends list.

### Aryaman

- Made most of my code contributions in app.py file, which basically contains code for our Flask endpoints
- Brainstormed and implemented all the basic CRUD endpoints needed for our application, specifically concerning those for User, user song lists, and user friend lists. Example: signup (POST), get_user_songs (GET), delete_friend (DELETE), friends_specific (GET) are just some of the endpoints I worked on. In all, I contributed to 15 endpoints
- Contributed to the /title endpoint, which basically returns a list of song search results queried by artist name and song title. Jeffrey worked on the part to fetch these results from Musicbrainz API, but I worked on the part to add these song results to the Song_Info db table so that for similar query searches we don't have to keep calling the API (basically caching the search results into db for faster retrieval in future queries)
- Made some changes to tables.sql file to reflect some of the changes that I proposed should be made to our postgres db table schemas (like removing a few column field headers from Song_Info table or changing the type of some fields)
- Was responsible for testing all the Flask endpoints I worked on - basically used Postman to make HTTP requests to these endpoints and verify that the JSON output I was getting was correct. While testing, I made sure to handle all edges cases (like throwing an error message if a user tries to update his profile with a username that is already taken, adding a song to his user song list twice, etc.)
- Continuing on the testing part, I made sure to verify that all the appropriate changes were being made to our database when the endpoints were being called (like User table being populated with entries corresponding to incoming users' data, rows being deleted properly from Friend table when a user deletes a friend from his friend list, etc.)
- Worked with Jeffrey, Collin, and Leyang to integrate the backend Flask code with the frontend so that our app was working end-to-end (ex. made sure that the add song feature works as expected, users are able to sign up seamlessly, the user friend list is getting properly fetched, etc.)
- Other github contributions: README.md (defined basic user roles for our app and wrote step-by-step instructions to get the database set up and use pgadmin properly), DESIGN.md (where I talk about the basic functionality and purpose that Flask and postgres db serve in our songrater app), RETRO_01.md (I was the retro leader for the 1st retrospective), lect12.md and lect13.md (I was scribe for the scrum standups in week 8), AGREEMENTS.md (wrote one of the 3 agreements/norms we set as a team), AI_CODING.md (contributed to this doc for lab05), LEADERSHIP.md (documented some leadership roles), LEARNING.md (talked about my familiarity with frontend/backend tech stack), aryaman.md (gave a brief introduction about myself and listed some ideas for our songrater app), and of course, CONTRIBS.md!
- Other team contributions: helped create a number of Kanban issues for the stuff we were working on (with acceptance criteria), posted helpful resources (to help with coding) on our team Discord channel, came up with engaging questions as Scrum Master for our scrum standups, and contributed to the MVP demo video/final presentation deliverables

- A note about the /graphs/contributors report: It only shows the commits that I made under the git config username "akdas16" specifically to main branch: it DOES NOT SHOW the commits I made under "Aryaman Das" username, which represents all the commits I made from my cloned repo. The "akdas16" commits were mostly .md file commits I made directly on Github under main branch, whereas the "Aryaman Das" commits were the coding commits (note the coding commits were pushed to my own "aryamandas" branch). Basically long story short: whatever commit history that is generated in the report shows only a fraction of what I actually contributed to our repo.


### Collin

- Implemented user authentication
- Developed Friends Page for friends list
- Developed Splash Screen for user's first visit
- Connected User Auth and Friends Lists to Flask Endpoints

### Amy

- Implemented Navigation Bar
- Implemented Landing Screen and modified Search Screen
- Designed app color palette
- Implemented and maintained app styling

Please note that this file will be updated regularly as our project progresses and contributions evolve.
