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
                                                'Organizational Setup (Global UI)',
                                                'Salesforce User Basics',
                                                'Salesforce Platform Basics',
                                                'Company-Wide Org Settings',
                                                'User Authentication',
                                                'Prepare Your Salesforce Org for Users',
                                                'Salesforce User Setup',
                                                'User Management',
                                                'Customize an Org to Support a New Business Unit',
                                                'Salesforce Security and Access',
                                                'How to Successfully Navigate Salesfor...',
                                                'Data Security',
                                                'Control Who Sees What',
                                                'Identity Basics',
                                                'Activity Management',
                                                'Security Specialist',
                                                'Standard and Custom Objects',
                                                'Data Modeling',
                                                'Lightning Experience Customization',
                                                'Customize a Salesforce Object',
                                                'Sales and Marketing Applications',
                                                'Accounts & Contacts for Lightning Experience',
                                                'Leads & Opportunities for Lightning Experience',
                                                'Products, Quotes, & Contracts',
                                                'Salesforce Content Overview',
                                                'Marketing Cloud Basics',
                                                'Campaign Basics',
                                                'Customize a Sales Path for Your Team',
                                                'Service and Support Applications',
                                                'Service Cloud for Lightning Experience',
                                                'Knowledge Search Basics',
                                                'Knowledge Basics for Lightning Experience',
                                                'Community Cloud Basics',
                                                'Build a Community with Knowledge and Chat',
                                                'Activity Management and Collaboration',
                                                'Activity Management',
                                                'Chatter Administration for Lightning Experience',
                                                'Data Management',
                                                'Data Quality',
                                                'Data Management',
                                                'Duplicate Management',
                                                'Import and Export with Data Management Tools',
                                                'Analytics - Reports and Dashboards',
                                                'Reports & Dashboards for Salesforce Classic',
                                                'Reports & Dashboards for Lightning Experience',
                                                'Create Reports and Dashboards for Sales and Marketing Managers',
                                                'Filter Report Data',
                                                'Lightning Experience Reports & Dashboards Specialist',
                                                'Workflow / Process Automation',
                                                'Workflow',
                                                'Lightning Flow',
                                                'Workflow Rule Migration',
                                                'Build a Discount Approval Process',
                                                'Quick Start: Process Builder',
                                                'Build a Mars Communication Uplink',
                                                'Build a Battle Station App',
                                                'Desktop and Mobile Administration',
                                                'Salesforce Mobile App Customization',
                                                'Outlook Integration',
                                                'AppExchange',
                                                'AppExchange Basics',
                                                'Business Administration Specialist',
                                                'Certified Administrator Practice Test',
                                                'Session-Based Permission Sets and Security',
                                                'Lightning Experience Rollout Specialist',
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
                                                'Security and Access',
                                                'Formulas & Validations',
                                                'Picklist Administration',
                                                'Session-Based Permission Sets and Security',
                                                'Transaction Security',
                                                'Configure Enterprise Territory Manage...',
                                                'Extending Custom Objects and Applicat...',
                                                'Considerations for Relationships',
                                                'Manage Custom Objects',
                                                'Lightning Experience Rollout Specialist',
                                                'Auditing and Monitoring',
                                                'Manage Events',
                                                'Event Monitoring',
                                                'Event Monitoring Analytics App',
                                                'Sales Cloud Applications',
                                                'Products, Quotes, & Contracts',
                                                'Collaborative Forecasts Setup',
                                                'Collaborative Forecasts Configuration',
                                                'Territory Management Basics',
                                                'Territory Management Best Practices',
                                                'Path & Workspaces',
                                                'Service Cloud Applications',
                                                'Entitlement Management',
                                                'Lightning Knowledge Setup and Customization',
                                                'Set Up Case Escalation and Entitlements',
                                                'Set Up Salesforce Knowledge',
                                                'Omni-Channel for Lightning Experience',
                                                'Case Feed',
                                                'Identity for Customers',
                                                'Data Management',
                                                'Duplicate Management',
                                                'Import and Export with Data Management Tools',
                                                'Improve Data Quality for Your Sales and Support Teams',
                                                'Improve Data Quality for a Recruiting App',
                                                'Content Management',
                                                'Set Up Salesforce CRM Content',
                                                'Knowledge Article Visibility and Data...',
                                                'Change Management',
                                                'Application Lifecycle and Development Models',
                                                'Change Set Development Model',
                                                'Analytics - Reports and Dashboards',
                                                'Evaluate Report Data with Summary Formulas',
                                                'Embed Dashboards and Report Charts on Lightning Pages',
                                                'Process Automation',
                                                'Approvals',
                                                'Advanced Formulas',
                                                'Leads & Opportunities for Lightning Experience',
                                                'Workflow Rule Migration',
                                                'Lightning Flow',
                                                'Apex Triggers',
                                                'Process Automation Specialist',
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
                                                'Salesforce Fundamentals',
                                                'CRM for Lightning Experience',
                                                'AppExchange Basics',
                                                'Platform Development Basics',
                                                'Data Modeling and Management',
                                                'Accounts & Contacts for Lightning Experience',
                                                'Leads & Opportunities for Lightning Experience',
                                                'Data Modeling',
                                                'Data Management',
                                                'Salesforce Connect',
                                                'Formulas Cheat Sheet',
                                                'Security',
                                                'Data Security',
                                                'Identity Basics',
                                                'Security Basics',
                                                'Security for Admins cheat sheet',
                                                'Security Specialist',
                                                'Business Logic and Process Automation',
                                                'User Management',
                                                'Formulas & Validations',
                                                'Flow Basics',
                                                'Lightning Flow',
                                                'Process Automation cheat sheet',
                                                'Which Automation Tool Do I Use?',
                                                'Quick Start: Process Builder',
                                                'Process Automation Specialist',
                                                'Social',
                                                'Chatter for Lightning Experience',
                                                'User Interface',
                                                'Aura Components Basics',
                                                'Lightning Design System',
                                                'Lightning App Builder',
                                                'Quick Start: Aura Components',
                                                'Lightning Experience Specialist',
                                                'Reporting',
                                                'Reports & Dashboards for Lightning Experience',
                                                'Quick Start: Reports & Dashboards',
                                                'Lightning Experience Reports & Dashboards Specialist',
                                                'Mobile',
                                                'Salesforce Mobile App Customization',
                                                'Salesforce Mobile App Rollout',
                                                'App Deployment',
                                                'AppExchange App Development',
                                                'Quick Start: Build Your First App',
                                                'Quick Start: Lightning App Builder',
                                                'Build a Battle Station App',
                                                'Build a Suggestion Box App',
                                                'App Customization Specialist',
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
                                                'Aura Components Skills & Tools',
                                                'Quick Start: Aura Components',
                                                'Lightning Experience Rollout Specialist',
                                                'Testing',
                                                'Apex Testing',
                                                'Developer Console Basics',
                                                'Debug and Deployment Tools',
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
                                                'Salesforce Fundamentals',
                                                'Salesforce & Heroku Integration',
                                                'Aura Components Skills & Tools',
                                                'Lightning Experience Development',
                                                'Data Modeling and Management',
                                                'Company-Wide Org Settings',
                                                'External ID and Unique ID Difference',
                                                'Salesforce Connect',
                                                'Quick Start: Salesforce Connect',
                                                'Compound Fields',
                                                'Logic and Process Automation',
                                                'Asynchronous Apex',
                                                'Dynamic Apex',
                                                'Security for Developers Cheat Sheet',
                                                'Transform SQL Queries to SOQL Queries in a Lightning App',
                                                'Build an Automated Workshop Management System',
                                                'User Interface',
                                                'Visualforce & Lightning Experience',
                                                'Aura Components Tips & Gotchas',
                                                'Lightning Components Cheat Sheet',
                                                'Build a Visualforce App with the Lightning Design System',
                                                'Templating with Visualforce',
                                                'Visualforce Mobile',
                                                'Build a Lightning App with the Lightning Design System',
                                                'Performance',
                                                'Big Object Basics',
                                                'Platform Cache Basics',
                                                'Best Practices for Optimizing Visualf...',
                                                'Lightning Data Service Basics for Aura Components',
                                                'Techniques for Optimizing Performance',
                                                'Large Data Volumes',
                                                'Query & Search Optimization Cheat Sheet',
                                                'Integration',
                                                'Lightning Platform API Basics',
                                                'Apex Integration Services',
                                                'Force.com REST API Cheat Sheet',
                                                'Force.com SOAP API Cheat Sheet',
                                                'Apex Metadata API',
                                                'Testing',
                                                'An Introduction to Apex Code Test Met...',
                                                'Understanding Test Data',
                                                'Testing Custom Controllers and Contro...',
                                                'Debug and Deployment Tools',
                                                'Required Superbadges',
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