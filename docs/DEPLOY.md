# Deployment

Our project is a mobile app built using React Native and Expo. Deployment requires Expo, which can deploy the app as either a web app or onto a phone. As of right now, we are in the process of migrating our app from development to full capabilities, and have not completely switched over to our AWS database. As such, the database has to be kept locally for now, and the app needs to be run on the same device that database is initialized on. Because of this, it would be better to run our app using the web build for now.

To deploy our app as of right now would require downloading postgres and running the sql scripts in melo/db. Instructions to do so are in the README file. Then, your postgres username and password would have to be exported, also following the instructions in the README.

Then, you would have to download typescript and expo go and all of the required components (npm i) and, in the melo folder, you would run: npx expo start, and then you could follow expo's prompts from there.

Because of this complexity, we recommend having a group member run it for you :)
