# Salesforce Trailhead Leaderboard

## About:

This is a simple application to help gain adoption of trailhead by allowing your team to see stats in the same manner as a gaming leaderboard.

## Demo URL:

https://trailhead-leaderboard.herokuapp.com/

This entire application can run for free on Heroku.

## Setup Procedure:

It is good to follow Heroku's [node.js tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs) to get an understanding of how node.js works on Heroku and to configure your local environment.



You will need to install the puppeteer buildpack: 

    heroku buildpacks:set jontewks/puppeteer

Be sure to re-add the node jetpack after addingpuppeteer, as it may get removed.

    heroku buildpacks:set heroku/php


You will then need to install both of the following add-ons:

 - [mLab MongoDB](https://elements.heroku.com/addons/mongolab)
 - [Heroku Scheduler](https://elements.heroku.com/addons/scheduler)

You'll want to create your own **.env** file with the MongoDB URI in it:

    MONGODB_URI=mongodb://<<username>>:<<password>>@<<your instance>>.mlab.com:<<port number>>/<<your instance>>

Grab a copy of the code and run it locally


## Other notes:

Sometimes the local heroku development enviornment would die in the bakground, [this stackoverflow tip](https://stackoverflow.com/questions/33048784/heroku-open-puma-port-5000-already-in-use-rails) was helpful




Lists all processes on port 5000:

    lsof -i :5000 

Find the PID and then kill the process with this command:

    sudo kill -9 <<pid>>



Pull Requests are Welcome!