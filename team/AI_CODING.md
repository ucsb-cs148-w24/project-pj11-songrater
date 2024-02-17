## AI tools

__Leyang__ -- Used ChatGPT to explore how to generate a music recommendation system. 

__Collin__ -- Used Cursor to identify errors in my code and fix them. Cursor was very helpful in generating recommended code as well.

__Emily__ -- Used ChatGPT to look at pros and cons for different ways of storing our rating system in a way that scales well. Also asked ChatGPT about database deployment options. Asked ChatGPT for some SQL code.

__Jeffrey__ -- Used ChatGPT and Midjourney to critique / redesign frontend UI quirks. Also used it to learn more frontend tricks to handle our tricky state management.

__Aryaman__ -- Used ChatGPT to explore how the syntax for basic SQL queries like SELECT, INSERT, UPDATE, and DELETE look like, as well as how you can integrate such kind of queries in Python code using the psycopg2 library (for making client calls to the postgres db)

__Katya__ -- Used ChatGPT for:
- **Test Scenario Generation**: Crafting comprehensive test scenarios for song management endpoints.
- **Documentation**: Generating testing documentation and in-code comments.
- **Implementation Guidance**: Advising on pytest usage and database mocking techniques.

## Outcomes

__Leyang__ -- Got an overview of the whole process: Data Collection, Data Preprocessing, Feature Engineering, Build User              Profilesm, Model Training, Evaluation, Deployment, Monitoring and Iteration. 

__Collin__ -- Was able to make progress on my code and fix errors that I was having trouble with. Specifically with user authentication in Auth0.

__Emily__ -- ChatGPT confirmed that the structure we came up with for the database is a good option, which give me confidence in our choice and implementation. ChatGPT also made it easier to find a good deployment option because it gave us a short list to look into.

__Jeffrey__ -- ChatGPT was super helpful in pointing me to the right direction with using specific react hooks (callback), but was a little lacking on the design aspect.

__Aryaman__ -- ChatGPT gave me exactly the sort of information that I was looking for, which saved a lot of time for me personally as I didn't have to scour the Internet so much for specific documentation regarding the psycopg2 library

__Katya__ -- Benefits observed:
- **Efficiency**: Accelerated test writing and documentation processes.
- **Quality**: Enhanced test and documentation comprehensiveness and clarity.
- **Learning**: Gained insights into advanced testing techniques and best practices.


## Reflections

### How useful this tool was / potentially could be for your coding effort going forward? 

__Leyang__ -- This tool was super useful by giving valuable suggestiongs from how to fix bugs in specific codes to the overall process of how to generate a recommendation system. 

__Collin__ -- Tool is super useful as it makes coding much less frustrating. Since it has your entire code base as context, it is able to generate accurate advice and the code is usually correct.

__Emily__ -- I think that ChatGPT is a good way to "rubber duck", and it can suggest things that I might not orignally think about. Becuase I'm not very familar with SQL, it's useful for finding out about ways to do things because it gives me the syntax for my thoughts, which is really useful.

__Jeffrey__ -- I've been a big fan of ChatGPT for a long time in speeding up my development process; while it's debugging skills aren't the greatest and sometimes lead me into stray alleyways, I still am able to learn a lot from its explanations and learn about new technologies to solve problems that I'm currently uisng.

__Aryaman__ -- I never used ChatGPT to such an extent as I have thus far in this project, and now that I have, I have gotten a better sense of the full potential that this AI tool has to offer, and I hope to keeping using this tool to make the overall coding process more efficient (and of course in the process foster my learning and coding/software development skills). As for this project, I could learn from ChatGPT how to integrate psycopg2 library with Flask from a CRUD point of view, and I may use this tool in the future for writing unit tests and/or other kinds of tests concerning the backend.

__Katya__ -- Using ChatGPT proved to be highly beneficial, boosting efficiency and quality in testing and documentation. 

### What steps you needed to (or couldn’t) take to ensure that the AI output was correct, understandable, and fair use

__Leyang__ -- I think it depends on what questions ChatGPT answers. If it is a certain conding task, after getting results from ChatGPT, we need to immediately test the code to see if it works. If it is a general suggestions such as how to generate amusic recommendation system, then we need to look for other resources, especially the experiences from people who have done that before, to check if the suggestions are applicable. 

__Collin__ -- I would test the AI's code by looking through its logic witih my own eyes and running it in my local environment and seeing if it works. In general, the chat feature with Cursor explains the code it produces very well too, so having the chat to break down specific parts of the code and reason it with logic makes it much easier to understand as well.

__Jeffrey__ -- For simple debugging errors, I would usually use a combination of my prior knowledge + testing the code out to determine whether ChatGPT was correct or not. For example, I was trying to use a variant of Binary Search to handle state management with our frontend song rankings, and ChatGPT wasn't able to provide a proper algorithm for it. After reasoning out my own algorithm + testing ChatGPT's, I used my algorithm over ChatGPTs to make things work effectively.

__Aryaman__ -- What I did (and would do for the future) is not to just blindly copy the code that ChatGPT generates, but to also read through the syntax/logic and understand what each line of code is doing to bring about the intended functionality. If I end up copying large chunks of code (which I haven't thus far but if I had to in the future), then for fair use purposes, I would give credit to ChatGPT as a source for assisting me through the coding process. To validate that the AI coding output generated for the psycopg2 library is correct, what I did was I rigorously tested the Flask endpoints that I implemented to ensure that they were working as expected - in other words, I put some seed data into the database for testing, and I called the get_user_songs and add_song endpoints to retrieve rows and insert rows into the db, and I tried with all kinds of input as test cases. Luckily for me, they worked beautifully as expected, and I didn't have to go through a lot of trial and error. Then I went back to my source code to read it line by line so that I knew what was going on (like why I would need a cursor variable, why I would need to call conn.commit() after each db modification, etc.) 

__Emily__ -- When looking at databases, I went to the service's actual website to confirm costs and packages, which ChatGPT was sometimes outdated about. A way to potentially keep the usage of ChatGPT fair use is to not copy large chunks of code, and instead just read it to understand the logic/syntax that it's using so that we can write our own code.

__Katya__ -- To ensure that the AI output was correct, I refined prompts with detailed context and iteratively debugged based on AI suggestions, always cross-verifying solutions against trusted sources for accuracy. 



