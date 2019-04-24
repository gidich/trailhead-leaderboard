var TrailblazerFactory = require('../factories/trailblazerModelFactory');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var TrailheadAdapter = require('../trailheadAdapter');

var trailheadAdapter = new TrailheadAdapter();
var trailblazerFactory = new TrailblazerFactory();
var moment = require('moment');

exports.trailblazer_list = async function(req,res){
    var self = this;
    var now = new Date();
    
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
    var devOneCert = await trailblazerFactory.aggregate(
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
                                        $in:[
                                            '$$badge.title',
                                            [
                                                'Salesforce Fundamentals',
                                                'Apex Basics & Database',
                                                'Salesforce Platform Basics',
                                                'Apex & .NET Basics',
                                                'Visualforce Basics',
                                                'Quick Start: Visualforce',
                                                'CRM for Lightning Experience',
                                                'Data Modeling',
                                                'AppExchange Basics',
                                                'AppExchange Partner Basics',
                                                'Platform Development Basics',
                                                'Salesforce Mobile App Customization',
                                                'Salesforce Technology Model',
                                                'Quick Start: Build Your First App',
                                                'Build a Suggestion Box App',
                                                'Data Modeling and Management',
                                                'Data Management',
                                                'Import and Export with Data Management Tools',
                                                'Logic and Process Automation',
                                                'Database & .NET Basics',
                                                'Formulas & Validations',
                                                'Lightning Flow',
                                                'Quick Start: Process Builder',
                                                'Apex Triggers',
                                                'Control Flow Statements',
                                                'Build a Conference Management App',
                                                'Quick Start: Apex',
                                                'Search Solution Basics',
                                                'Triggers and Order of Execution',
                                                'AppExchange Security Review',
                                                'Data Security',
                                                'User Interface',
                                                'Aura Components Basics',
                                                'Lightning Experience Development',
                                                'Lightning Apps',
                                                'Aura Components Core Concepts',
                                                'Aura Components Skills & Tools'
                                            ]
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
                                                    now.getMonth() + 1 
                                                ]
                                            },
                                            {
                                                $eq : [
                                                    {$year:'$$badge.completed_at'}, 
                                                    now.getFullYear()
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
    var lastMonth = moment().subtract(1,'months').toDate();
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
                                                    lastMonth.getMonth() + 1
                                                ]
                                            },
                                            {
                                                $eq : [
                                                    {$year:'$$badge.completed_at'}, 
                                                    lastMonth.getFullYear()
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
    var twoMonthsAgo =  moment().subtract(2,'months').toDate();
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
                                                    twoMonthsAgo.getMonth() + 1
                                                ]
                                            },
                                            {
                                                $eq : [
                                                    {$year:'$$badge.completed_at'}, 
                                                    twoMonthsAgo.getFullYear()
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
        trailblazersByBadges:trailblazersByBadges,
        devOneCert:devOneCert
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