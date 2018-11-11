var TrailblazerFactory = require('../factories/trailblazerModelFactory');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var TrailheadAdapter = require('../trailheadAdapter');

var trailheadAdapter = new TrailheadAdapter();
var trailblazerFactory = new TrailblazerFactory();
var moment = require('moment');

exports.trailblazer_list = async function(req,res){
    var self = this;
    var badgeLeaders
   var badgeLeaders = await trailblazerFactory.find(
        {},
        ['full_name','badgeCount'],
        {
            sort:{
                badgeCount:-1
            }
        }
    );
    var pointLeaders = await trailblazerFactory.find(
        {},
        ['full_name','points'],
        {
            sort:{
                points:-1
            }
        }
    );
    var newestTrailblazers = await trailblazerFactory.leanFind(
        {},
        ['full_name','created_at'],
        {
            sort:{
                created_at:-1
            }
        }
    );
    newestTrailblazers.forEach((element,index,array) => {
        newestTrailblazers[index].created_at = moment(element.created_at).fromNow();
    });
    
    var results = {
        badgeLeaders: badgeLeaders,
        pointLeaders:pointLeaders,
       newestTrailblazers:newestTrailblazers
    }
    res.render('pages/index',results);
}

exports.trailblazer_create_get = function(req, res) {
    res.render('pages/trailblazerCreate');
};

exports.trailblazer_create_post = async function(req, res) {
    const errors = validationResult(req);
    var results = await trailheadAdapter.getProfileInfo(req.body.trailblazer_url,await trailblazerFactory.getNew());
    await trailblazerFactory.save(results);
    res.render('pages/trailblazerConfirm',results);
};

