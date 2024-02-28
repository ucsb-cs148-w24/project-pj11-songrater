# System Architecture
## Diagram
![image](https://github.com/ucsb-cs148-w24/project-pj11-songrater/assets/61306390/9151f2ed-c855-4b51-8457-8af9e1afd4f5)


## Explanation
Within our program, there are a lot of moving parts to make everything work. 

### Frontend (React Native Expo Go)
Our frontend application is a React Native Expo Go App. We mainly have a couple of screens to manage a user's navigation throughout our app, but this will be explored into more detail in the `UX Considerations` section of this document. Some frontend logic was difficult to implement because we had to conditionally render certain objects depending on user actions (we used React Rollback hooks to render which song to compare with next), but most of the logic was passed off into the backend.

### Backend (Python Flask)

#### Database (PostgreSQL)

#### External Libraries / Sources (MusicBrainz, Firebase)
To receive our necessary song information, we query an open-source, online, music database called [MusicBrainz](https://musicbrainz.org/). MusicBrainz stores much more information than we initially expected, and it's not neatly organized like other music libraries (Spotify & Apple Music). Thus, we had to utilize original methods of filtering out the information we want (song title, artist, genre, general music information, etc...) and making sure we don't have duplicate releases of a certain song. 

# Important Team Decisions
To enable greater efficiency, quality, and cooperation within the team, we made two key changes: breaking large issues down into well-scoped bite-sized tasks to facilitate progress tracking and independent contribution, and categorizing our work into testing, frontend, backend aligned to team members' abilities to allow for increased pairing opportunities. These decisions have helped improve transparency around ownership and increase collaboration where it makes sense.
# UX Considerations
## High Level Task / Flow
![image](https://github.com/ucsb-cs148-w24/project-pj11-songrater/assets/61306390/bb7a37c8-f2fc-4d46-b708-7eca5495ea37)


**Explanation**
