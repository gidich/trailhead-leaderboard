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
        ['full_name','badgeCount','trailblazerId'],
        {
            sort:{
                badgeCount:-1
            }
        }
    );
    var pointLeaders = await trailblazerFactory.find(
        {},
        ['full_name','points','trailblazerId'],
        {
            sort:{
                points:-1
            }
        }
    );
    var newestTrailblazers = await trailblazerFactory.leanFind(
        {},
        ['full_name','created_at','trailblazerId'],
        {
            sort:{
                created_at:-1
            }
        }
    );
    var badgesThisMonth = await trailblazerFactory.aggregate(
        [
            {
                $project: {
                    trailblazerId:1,
                    full_name:1,
                    badges: {
                        $size: {
                            $filter: {
                                input: "$badges",
                                as: "badge",
                                cond: {
                                        $and:[
                                            {
                                                $eq : [
                                                    {$month:'$$badge.completed_at'}, 
                                                    (new Date()).getMonth() + 1
                                                ]
                                            },
                                            {
                                                $eq : [
                                                    {$year:'$$badge.completed_at'}, 
                                                    (new Date()).getFullYear()
                                                ]
                                            }
                                        ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: {badges:-1}
            }
        ]            
    );
    var badgesLastMonth = await trailblazerFactory.aggregate(
        [
            {
                $project: {
                    trailblazerId:1,
                    full_name:1,
                    badges: {
                        $size: {
                            $filter: {
                                input: "$badges",
                                as: "badge",
                                cond: {
                                        $and:[
                                            {
                                                $eq : [
                                                    {$month:'$$badge.completed_at'}, 
                                                    (new Date()).getMonth() 
                                                ]
                                            },
                                            {
                                                $eq : [
                                                    {$year:'$$badge.completed_at'}, 
                                                    (new Date()).getFullYear()
                                                ]
                                            }
                                        ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: {badges:-1}
            }
        ]            
    );
    var badges2MonthsAgo = await trailblazerFactory.aggregate(
        [
            {
                $project: {
                    trailblazerId:1,
                    full_name:1,
                    badges: {
                        $size: {
                            $filter: {
                                input: "$badges",
                                as: "badge",
                                cond: {
                                        $and:[
                                            {
                                                $eq : [
                                                    {$month:'$$badge.completed_at'}, 
                                                    (new Date()).getMonth() -1
                                                ]
                                            },
                                            {
                                                $eq : [
                                                    {$year:'$$badge.completed_at'}, 
                                                    (new Date()).getFullYear()
                                                ]
                                            }
                                        ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: {badges:-1}
            }
        ]            
    );
    newestTrailblazers.forEach((element,index,array) => {
        newestTrailblazers[index].created_at = moment(element.created_at).fromNow();
    });
    var trailblazersByBadges = await trailblazerFactory.aggregate(
        [
            { 
                $unwind : "$badges" 
            },
            {
                $group : { 
                    _id: "$badges.title", 
                    path: {$first:"$badges.path"},
                    trailblazers: { $push: "$$ROOT" }
                }
            },
            { 
                $project: { 
                    _id: 1, 
                    path: 1,
                    trailblazers: {
                        $map: {
                            input: "$trailblazers",
                            as: "t",
                            in: {
                                full_name: "$$t.full_name",
                                avatarImage: "$$t.avatarImage"
                            }
                        }
                    }
                }
            },
            { 
                $sort: {
                    _id: 1
                }
            }
        ]
    )
    var results = {
        badgeLeaders: badgeLeaders,
        pointLeaders:pointLeaders,
        newestTrailblazers:newestTrailblazers,
        badgesThisMonth:badgesThisMonth,
        badgesLastMonth:badgesLastMonth,
        badges2MonthsAgo:badges2MonthsAgo,
        trailblazersByBadges:trailblazersByBadges
    }
    console.log(results);
    res.render('pages/index',results);
}

exports.trailblazer_create_get = function(req, res) {
    res.render('pages/trailblazerCreate');
};
exports.trailblazer_get = async function(req,res){
    var result = await trailblazerFactory.getById(req.params.trailblazerId);
    res.render('pages/trailblazerDetails',result);
}
exports.trailblazer_create_post = async function(req, res) {
    const errors = validationResult(req);
    var results = await trailheadAdapter.getProfileInfo(req.body.trailblazer_url);
    await trailblazerFactory.set(results);
    res.render('pages/trailblazerConfirm',results);
};