"use strict";
const puppeteer = require('puppeteer');

module.exports = class TrailheadAdapter {
    async extractProfileDetails(page){
        let results = await page.evaluate(() => {

            var action = app.get("c.fetchTrailheadBadges");
            var uid = app.get("v.uid");
          //  var $ = document.querySelector.bind(document);
           // var $$ = document.querySelectorAll.bind(document);

            var badgeList = [];
            var badgeCount = parseInt(
                document.querySelector("c-trailhead-rank").shadowRoot.querySelector("c-lwc-card").shadowRoot.querySelector("div > slot").assignedNodes()[1].querySelector("c-lwc-tally:nth-child(1)").shadowRoot.querySelector("span > span.tds-tally__count.tds-tally__count_success").textContent.trim()
              );

            var getProfile = function(badges) {
                try {
                    console.log("getting profile");
                    var profileUser = app.get("v.profileUser");
                    var results = {
                    trailblazerId: uid,
                    profileShortcutUrl: document
                        .querySelector(
                        "#lightning > div > div > div.main > div > div.slds-container_x-large.slds-container_center.profile-content > div > div > div > div:nth-child(1) > article > div > div.slds-grid.slds-wrap.slds-grid_vertical-align-center.slds-grid_align-spread > div > a"
                        )
                        .getAttribute("href"),
                    profileUrl: document
                        .querySelector(
                        "#lightning > div > div > div.main > div > div.slds-container_x-large.slds-container_center.profile-content > div > div > div > div:nth-child(1) > article > div > div.slds-grid.slds-wrap.slds-grid_vertical-align-center.slds-grid_align-spread > div > a"
                        )
                        .getAttribute("href"),
                    are_badges_public: profileUser.Is_Public_Profile__c,
                    bio: profileUser.AboutMe,
                    company: profileUser.CompanyName,
                    // created_at: null,
                    facebook: profileUser.FacebookProfileLink__c,
                    // favorite_badge: null,
                    /// favorite_character: null,
                    // favorite_park: null,
                    // favorite_team: null,
                    // favorite_tunes: null,
                    first_name: profileUser.FirstName,
                    full_name: profileUser.FirstName + " " + profileUser.LastName,
                    //  google: null,
                    job_role: profileUser.TBID_Role__c,
                    job_title: profileUser.Title,
                    last_name: profileUser.LastName,
                    //  level: null,
                    linkedin: profileUser.LinkedInProfileLink__c,
                    relation: profileUser.Relationship_To_Salesforce__c,
                    slug: profileUser.TrailblazerId__c,
                    th_sfid: uid,
                    twitter: profileUser.TwitterProfileLink__c,
                    website_url: profileUser.Company_Website__c,
                    work_info: profileUser.CompanyName,
                    userPath: "/id/" + profileUser.TrailblazerId__c,
                    badges: badges,
                    badgeCount: badgeCount,
                    points: document.querySelector("c-trailhead-rank").shadowRoot.querySelector("c-lwc-card").shadowRoot.querySelector("div > slot").assignedNodes()[1].querySelector("c-lwc-tally:nth-child(2)").shadowRoot.querySelector("span > span.tds-tally__count.tds-tally__count_success").textContent
                        .replace(",", ""),
                    trails: document.querySelector("c-trailhead-rank").shadowRoot.querySelector("c-lwc-card").shadowRoot.querySelector("div > slot").assignedNodes()[1].querySelector("c-lwc-tally:nth-child(3)").shadowRoot.querySelector("span > span.tds-tally__count.tds-tally__count_success").textContent,
                    rankImage: document.querySelector("c-trailhead-rank").shadowRoot.querySelector("c-lwc-card").shadowRoot.querySelector("div > slot").assignedNodes()[0].querySelector("img").getAttribute("src"),
                    rank: document.querySelector("c-trailhead-rank").shadowRoot.querySelector("c-lwc-card").shadowRoot.querySelector("div > slot").assignedNodes()[0].querySelector("img").getAttribute("alt"),
                    avatarImage: app.get("v.profilePhotoUrl")
                    };

                    //console.log(results);
                    return results;
                    // callback(results);
                } 
                
                catch (error) {
                console.log(error);
                }
            };

            return new Promise(function(resolve, reject) { 
            var getBadges =  function(badgeList) {
                //
                    console.log("starting getbadges");
                    action.setParams({
                        userId: uid,
                        language: "en-US",
                        skip: badgeList.length,
                        perPage: 30,
                        filter: "All"
                    });

                    action.setCallback(this, function(response) {
                        console.log("getting badges");
                        var state = response.getState();
                        if(state == "SUCCESS"){
                        var trailheadBadges = JSON.parse(response.getReturnValue().body).value[0];
                        trailheadBadges.EarnedAwards.forEach(badge => {
                            badgeList.push({
                            id: badge.Id,
                            completed_at: badge.AwardedOn,
                            icon_url: badge.Award.ImageUrl,
                            path: badge.LearningUrl,
                            points: badge.EarnedPointTotal,
                            title: badge.Award.Label,
                            type: badge.AwardType,
                            api_name: badge.Id
                            });
                        });
                        console.log("loaded " + badgeList.length + "bages");
                        if (badgeCount > badgeList.length && badgeList.length > 0) {
                            getBadges(badgeList);
                        } else {
                            
                            var profile = getProfile(badgeList);
                            console.log("success!!  " + JSON.stringify(profile));
                            resolve (profile);
                        }
                        }else{
                            console.log(state);
                           reject(new Error(response.getError()));
                        }
                        
                    });
                    $A.getCallback(function() {
                        console.log("enqueing Action");
                        $A.enqueueAction(action);
                    })();
                
            };

          //  console.log("starting to get badges");
          //  var doit = new Promise(function(resolve, reject) { 
           // getBadges(badgeList).then( function(response){ resolve(response)}).catch(function(error){reject(new Error(response.getError()));})
           // Promise.resolve(profile);
           /// });
           // await doit();
              getBadges(badgeList);
            //console.log("all done");

            });
            
        });
        return results;
    }

    getProfileInfo(url){
        var self = this;
        return new Promise(function(resolve,reject){
            puppeteer
                .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
                .then(async browser => {
                    try{
                        console.log(`starting browser and visiting:${url}`);
                        let page = await browser.newPage();
                        page.on('console', msg => console.log(msg.text()));
                        await page.setViewport({width:1920, height:1080});
                        await page.goto(url, {waitUntil: 'networkidle0'});
                        await page.waitFor("c-trailhead-rank",{timeout:500}).then(() => console.log('found user profile'));
                        //await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.4.1.slim.min.js'});
                        let results = await self.extractProfileDetails(page);
                        await browser.close();
                        resolve(results);  
                    }catch(err){
                        console.log(err);
                        await browser.close();
                        reject(err);
                    }
            })
        })
    }
}