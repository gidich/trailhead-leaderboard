const express = require('express')
var bodyParser = require('body-parser')
const { check } = require('express-validator/check');
var validator = require('validator');

const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
var mongoose = require('mongoose');

// Controllers
var team_controller = require('./controllers/teamController');
var trailblazer_controller = require('./controllers/trailblazerController');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:true
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

express()
    .use(express.json())

// parse application/x-www-form-urlencoded
.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
.use(bodyParser.json())


    .use(express.static(path.join(__dirname,'public')))
    .set('views',path.join(__dirname,'views'))
    .set('view engine', 'ejs')
    .get('/', trailblazer_controller.trailblazer_list)
    .get('/about', (req, res) => res.render('pages/about'))
    .get('/teams', team_controller.team_list)
    .post('/team/register', team_controller.team_create_post)
    .get('/trailblazers', trailblazer_controller.trailblazer_list)
    .get('/trailblazer/create', trailblazer_controller.trailblazer_create_get)
    .get('/trailblazer/details/:trailblazerId', trailblazer_controller.trailblazer_get)
    .post(
        '/trailblazer/create',
        [
            check('trailblazer_url').isURL()
        ], 
        trailblazer_controller.trailblazer_create_post)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))