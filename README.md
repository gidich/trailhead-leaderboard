# Salesforce Trailhead Leaderboard


## About:

This is a simple application to help gain adoption of trailhead by allowing your team to see stats in the same manner as a gaming leaderboard.

## Demo URL:

https://sample-trailhead-leaderboard.herokuapp.com/

This entire application can run **for free** on Heroku.


## Quickstart:

1. Click the **Deploy to Heroku** button

    [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

    - For **App Name**, specify a name for your application. For example, if you specify sample-trailhead-leaderboard, your application will be available at http://sample-trailhead-leaderboard.herokuapp.com. Your app name has to be unique on the herokuapp.com domain.
    - Click the **Deploy App** button
    
2. Configure the schedule: (this keeps the leaderboard up to date daily)
    - Navigate to the heroku dashboard https://dashboard.heroku.com/apps and select your app.
    - Choose **Resources** > **Heroku Scheduler** (a new browser tab will appear)
    - Click **Create Job**  (the Job Editor side panel will display)
    - In the Schedule area, choose **Every day at...** and `1:00 PM UTC`
    - In the Run Command area next to the dollar sign ($), type in `node scheduled-refresh.js`
    - Click **Save Job**
    

## Contributing:

`Pull Requests are Welcome!`

## Additional Details, how to run locally

It is good to follow Heroku's [node.js tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs) to get an understanding of how node.js works on Heroku and to configure your local environment.

Grab a copy of the code and run it locally

You'll want to create your own **.env** file with the MongoDB URI in it:

    MONGODB_URI=mongodb://<<username>>:<<password>>@<<your instance>>.mlab.com:<<port number>>/<<your instance>>

There is a `launch.json` file part of the project to make it easy to debug with VSCode.

## Troubleshooting Helpful notes:

**Error Logs**

To view error logs:

    heroku logs --tail -a <<appname>>

**Kill Local Instance**

To kill the local development environment:

Sometimes the local heroku development enviornment may die in the background, [this stackoverflow tip](https://stackoverflow.com/questions/33048784/heroku-open-puma-port-5000-already-in-use-rails) was helpful:

Lists all processes on port 5000:

    lsof -i :5000 

Find the PID and then kill the process with this command:

    sudo kill -9 <<pid>>

**Best Performance**

For best performance, ensure that the app is running in production mode (it should be already by default):

    heroku config:set NODE_ENV=production -a <<your app aname>>

## Special thanks to the following tools and utilities:

The puppeteer buildpack used to scrape trailhead profiles:

    heroku buildpacks:set jontewks/puppeteer

Node JS:

    heroku buildpacks:set heroku/nodejs

Additional Addons:

 - [mLab MongoDB](https://elements.heroku.com/addons/mongolab)
 - [Heroku Scheduler](https://elements.heroku.com/addons/scheduler)
 
 
 
[![DeepScan grade](https://deepscan.io/api/teams/3663/projects/5396/branches/41392/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3663&pid=5396&bid=41392)
