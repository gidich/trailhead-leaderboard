# Salesforce Trailhead Leaderboard

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


Quickstart:

1. Click the **Deploy to Heroku** button
    - For **App Name**, specify a name for your application. For example, if you specify trailhead-leaderboard, your application will be available at http://trailhead-leaderboard.herokuapp.com. Your app name has to be unique on the herokuapp.com domain.
    - Click the **Deploy For Free** button

## About:

This is a simple application to help gain adoption of trailhead by allowing your team to see stats in the same manner as a gaming leaderboard.

## Demo URL:

https://trailhead-leaderboard.herokuapp.com/

This entire application can run **for free** on Heroku.

## Setup Procedure:

It is good to follow Heroku's [node.js tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs) to get an understanding of how node.js works on Heroku and to configure your local environment.



You will need to install the puppeteer buildpack: 

    heroku buildpacks:set jontewks/puppeteer

Be sure to re-add the node jetpack after adding puppeteer, as it may get removed.

    heroku buildpacks:set heroku/nodejs

Ensure heroku is running node in produciton mode:
    heroku config:set NODE_ENV=production -a <<your app aname>>


You will then need to install both of the following add-ons:

 - [mLab MongoDB](https://elements.heroku.com/addons/mongolab)
 - [Heroku Scheduler](https://elements.heroku.com/addons/scheduler)

You'll want to create your own **.env** file with the MongoDB URI in it:

    MONGODB_URI=mongodb://<<username>>:<<password>>@<<your instance>>.mlab.com:<<port number>>/<<your instance>>

Grab a copy of the code and run it locally


Once you're set up and running it locally, push the code to heroku, test it out there.

You can schedule the list to auto update by adding the following to your scheduled task:

    node scheduled-refresh.js

Dyno Size: `FREE`  
Frequency: `Daily`  
Next Due: `00`

## Other notes:

Sometimes the local heroku development enviornment would die in the bakground, [this stackoverflow tip](https://stackoverflow.com/questions/33048784/heroku-open-puma-port-5000-already-in-use-rails) was helpful:


Lists all processes on port 5000:

    lsof -i :5000 

Find the PID and then kill the process with this command:

    sudo kill -9 <<pid>>

Troubleshooting:

View error logs:

    heroku logs --tail -a <<appname>>

## Contributing:

`Pull Requests are Welcome!`