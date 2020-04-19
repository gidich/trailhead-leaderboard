var TrailblazerFactory = require('../factories/trailblazerModelFactory');
var TrailblazerRequestFactory = require('../factories/trailblazerRequestModelFactory');

const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var TrailheadAdapter = require('../trailheadAdapter');

var trailheadAdapter = new TrailheadAdapter();
var trailblazerFactory = new TrailblazerFactory();
var trailblazerRequestFactory = new TrailblazerRequestFactory();

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

    //  Array.from(document.querySelectorAll("div[data-react-class='ModuleBrick']")).reduce((acc,field) => { return acc + ((field.querySelector(`[data-test='content-title'] a`) == null) ? '' : `'${field.querySelector(`[data-test='content-title'] a`).innerText}',\n`)},'\n');
'Administrator Exam Overview','Salesforce Platform Basics','User Authentication','Prepare Your Salesforce Org for Users','User Management','Customize an Org to Support a New Business Unit','How to Successfully Navigate Salesforce Security with Trailhead','Data Security','Identity Basics','Control Who Sees What','Activity Management','Security Specialist','Data Modeling','Lightning Experience Customization','Customize a Salesforce Object','Accounts & Contacts for Lightning Experience','Leads & Opportunities for Lightning Experience','Products, Quotes, & Contracts','Salesforce Content Overview','Campaign Basics','Customize a Sales Path for Your Team','Service Cloud for Lightning Experience','Service Cloud Efficiency','Knowledge Basics for Lightning Experience','Build a Community with Knowledge and Chat','Activity Management','Data Management','Duplicate Management','Import and Export with Data Management Tools','Reports & Dashboards for Lightning Experience','Create Reports and Dashboards for Sales and Marketing Managers','Lightning Experience Reports & Dashboards Specialist','Workflow','Lightning Flow','Build a Discount Approval Process','Quick Start: Process Builder','Build a Battle Station App','Branded Mobile Apps with Mobile Publisher','Lightning App Builder','AppExchange Basics','Business Administration Specialist','Study for the Administrator Certification Exam','Certified Administrator Practice Test','Admin Study Cohort','Certification Days','Certification Preparation for Administrator Instructor-Led Course (CRT101)'


    var adminCert = await trailblazerFactory.aggregate(
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
                                                'Administrator Exam Overview',
                                                'Salesforce Platform Basics',
                                                'User Authentication',
                                                'Prepare Your Salesforce Org for Users',
                                                'User Management',
                                                'Customize an Org to Support a New Business Unit',
                                                'How to Successfully Navigate Salesforce Security with Trailhead',
                                                'Data Security',
                                                'Identity Basics',
                                                'Control Who Sees What',
                                                'Activity Management',
                                                'Security Specialist',
                                                'Data Modeling',
                                                'Lightning Experience Customization',
                                                'Customize a Salesforce Object',
                                                'Accounts & Contacts for Lightning Experience',
                                                'Leads & Opportunities for Lightning Experience',
                                                'Products, Quotes, & Contracts',
                                                'Salesforce Content Overview',
                                                'Campaign Basics',
                                                'Customize a Sales Path for Your Team',
                                                'Service Cloud for Lightning Experience',
                                                'Service Cloud Efficiency',
                                                'Knowledge Basics for Lightning Experience',
                                                'Build a Community with Knowledge and Chat',
                                                'Activity Management',
                                                'Data Management',
                                                'Duplicate Management',
                                                'Import and Export with Data Management Tools',
                                                'Reports & Dashboards for Lightning Experience',
                                                'Create Reports and Dashboards for Sales and Marketing Managers',
                                                'Lightning Experience Reports & Dashboards Specialist',
                                                'Workflow',
                                                'Lightning Flow',
                                                'Build a Discount Approval Process',
                                                'Quick Start: Process Builder',
                                                'Build a Battle Station App',
                                                'Branded Mobile Apps with Mobile Publisher',
                                                'Lightning App Builder',
                                                'AppExchange Basics',
                                                'Business Administration Specialist',
                                                'Study for the Administrator Certification Exam',
                                                'Certified Administrator Practice Test',
                                                'Admin Study Cohort',
                                                'Certification Days',
                                                'Certification Preparation for Administrator Instructor-Led Course (CRT101)'
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

    var advancedAdminCert = await trailblazerFactory.aggregate(
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
                                                'Prerequisite: Salesforce Administrator',
                                                'Advanced Administrator Exam Overview',
                                                'Formulas & Validations',
                                                'Picklist Administration',
                                                'Session-Based Permission Sets and Security',
                                                'Configure Enterprise Territory Management Permissions and Access',
                                                'Considerations for Relationships',
                                                'Manage Custom Objects',
                                                'Lightning Experience Rollout Specialist',
                                                'Manage Events',
                                                'Event Monitoring',
                                                'Event Monitoring Analytics App',
                                                'Products, Quotes, & Contracts',
                                                'Collaborative Forecasts Setup',
                                                'Collaborative Forecasts Configuration',
                                                'Territory Management Basics',
                                                'Territory Management Best Practices',
                                                'Path & Workspaces',
                                                'Entitlement Management',
                                                'Lightning Knowledge Setup and Customization',
                                                'Set Up Case Escalation and Entitlements',
                                                'Set Up Salesforce Knowledge',
                                                'Web Chat Basics',
                                                'Omni-Channel for Lightning Experience',
                                                'Case Feed',
                                                'Identity for Customers',
                                                'Duplicate Management',
                                                'Import and Export with Data Management Tools',
                                                'Improve Data Quality for Your Sales and Support Teams',
                                                'Improve Data Quality for a Recruiting App',
                                                'Set Up Salesforce CRM Content',
                                                'Knowledge Article Visibility and Data Category considerations',
                                                'Application Lifecycle and Development Models',
                                                'Change Set Development Model',
                                                'Evaluate Report Data with Formulas',
                                                'Embed Dashboards and Report Charts on Lightning Pages',
                                                'Approvals',
                                                'Advanced Formulas',
                                                'Leads & Opportunities for Lightning Experience',
                                                'Workflow Rule Migration',
                                                'Lightning Flow',
                                                'Apex Triggers',
                                                'Process Automation Specialist',
                                                'Certification Preparation for Adv Administrator Instructor-Led Course (CRT211)',
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

    var platformAppBuilderCert = await trailblazerFactory.aggregate(
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
                                                'Platform App Builder Exam Overview',
                                                'Lightning Experience Customization',
                                                'Service Cloud for Lightning Experience',
                                                'Leads & Opportunities for Lightning Experience',
                                                'Data Modeling',
                                                'Data Management',
                                                'Picklist Administration',
                                                'Duplicate Management',
                                                'Data Security',
                                                'Identity Basics',
                                                'Security Specialist',
                                                'Formulas & Validations',
                                                'Formulas Cheat Sheet',
                                                'Lightning Flow',
                                                'Screen Flow Distribution',
                                                'Lightning Experience Productivity',
                                                'Process Automation cheat sheet',
                                                'Which Automation Tool Do I Use?',
                                                'Process Automation Specialist',
                                                'Chatter Administration for Lightning Experience',
                                                'Lightning App Builder',
                                                'Lightning Experience Specialist',
                                                'Reports & Dashboards for Lightning Experience',
                                                'Create Reports and Dashboards for Sales and Marketing Managers',
                                                'Lightning Experience Reports & Dashboards Specialist',
                                                'Salesforce Mobile App Customization',
                                                'Build a Battle Station App',
                                                'App Customization Specialist',
                                                'Study for the Platform App Builder Exam',
                                                'Certification Prep for Platform App Builder Instructor-Led Course (CRT402)',
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
                                                'Platform Developer I Exam Overview',
                                                'Apex & .NET Basics',
                                                'Platform Development Basics',
                                                'Data Modeling',
                                                'Data Management',
                                                'Formulas & Validations',
                                                'Lightning Flow',
                                                'Apex Basics & Database',
                                                'Apex Triggers',
                                                'Database & .NET Basics',
                                                'Search Solution Basics',
                                                'Triggers and Order of Execution',
                                                'Process Automation Specialist',
                                                'Apex Specialist',
                                                'Visualforce Basics',
                                                'Lightning Experience Development',
                                                'Aura Components Core Concepts',
                                                'Aura Components Skills & Tools',
                                                'Why Use the Aura Components Programming Model?',
                                                'Apex Testing',
                                                'Execute Anonymous Blocks',
                                                'Developer Console Basics',
                                                'Asynchronous Apex',
                                                'Debug Logs',
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

    var devTwoCert = await trailblazerFactory.aggregate(
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
                                                'Platform Developer II Exam Overview',
                                                'Salesforce & Heroku Integration',
                                                'Lightning Experience Development',
                                                'Company-Wide Org Settings',
                                                'External ID and Unique ID Difference',
                                                'Quick Start: Salesforce Connect',
                                                'Compound Fields',
                                                'Apex Triggers',
                                                'Asynchronous Apex',
                                                'Dynamic Apex',
                                                'Security for Developers Cheat Sheet',
                                                'Lightning Flow',
                                                'Visualforce & Lightning Experience',
                                                'Aura Components Basics',
                                                'Lightning Components Cheat Sheet',
                                                'Lightning Design System for Developers',
                                                'Build a Visualforce App with the Lightning Design System',
                                                'Templating with Visualforce',
                                                'Big Object Basics',
                                                'Platform Cache Basics',
                                                'Best Practices for Optimizing Visualforce Performance',
                                                'Lightning Data Service Basics for Aura Components',
                                                'Techniques for Optimizing Performance',
                                                'Large Data Volumes',
                                                'Query & Search Optimization Cheat Sheet',
                                                'Lightning Platform API Basics',
                                                'Apex Integration Services',
                                                'Force.com REST API Cheat Sheet',
                                                'Force.com SOAP API Cheat Sheet',
                                                'Apex Metadata API',
                                                'Apex Testing',
                                                'An Introduction to Apex Code Test Methods',
                                                'Understanding Test Data',
                                                'Testing Custom Controllers and Controller Extensions',
                                                'Apex Specialist',
                                                'Data Integration Specialist',
                                                'Aura Components Specialist',
                                                'Advanced Apex Specialist',
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


/*

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
*/
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
                                trailblazerId:"$$t.trailblazerId",
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
       // badgesThisMonth:badgesThisMonth,
       // badgesLastMonth:badgesLastMonth,
       // badges2MonthsAgo:badges2MonthsAgo,
        trailblazersByBadges:trailblazersByBadges,
        devOneCert:devOneCert,
        devTwoCert:devTwoCert,
        adminCert:adminCert,
        advancedAdminCert:advancedAdminCert,
        platformAppBuilderCert:platformAppBuilderCert,
    }
    console.log(results);
    res.render('pages/index',results);
}
exports.trailblazer_create_get = function(req, res) {
    res.render('pages/trailblazerCreate');
}
exports.trailblazer_get = async function(req,res){
    var result = await trailblazerFactory.getById(req.params.trailblazerId);
    res.render('pages/trailblazerDetails',result);
}
exports.trailblazer_create_post = async function(req, res) {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        var trailblazerRequest = trailblazerRequestFactory.getNew();
        trailblazerRequest.profileUrl = req.body.trailblazer_url;
        trailblazerRequest.successfullyParsed = false;
        await trailblazerRequestFactory.set(trailblazerRequest);
    
        try {
            var results = await trailheadAdapter.getProfileInfo(req.body.trailblazer_url);
            await trailblazerFactory.set(results);
            trailblazerRequest.successfullyParsed = true;
            await trailblazerRequestFactory.set(trailblazerRequest);
            res.render('pages/trailblazerConfirm',results);
            
        } catch (error) {
            res.render('pages/trailblazerErrorNoted');
        }
        
    }else{
        console.log(errors.array());
        res.render('pages/trailblazerAddErrors',{errors:errors.array()});
    }
};