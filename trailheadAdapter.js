"use strict";
const puppeteer = require('puppeteer');

module.exports = class TrailheadAdapter {
    async extractProfileDetails(page){
        let results = await page.evaluate(async() => {

            var badgeCount = parseInt(
                document.querySelector("c-trailhead-rank").shadowRoot.querySelector("c-lwc-card").shadowRoot.querySelector("div > slot").assignedNodes()[1].querySelector("c-lwc-tally:nth-child(1)").shadowRoot.querySelector("span > span.tds-tally__count.tds-tally__count_success").textContent.trim()
            );

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function loadBadges(){
                var loadedBadges = document.querySelector("c-lwc-trailhead-badges").shadowRoot.querySelector("c-lwc-card div").children.length;
                while( loadedBadges < badgeCount){
                    document.querySelector("c-lwc-trailhead-badges").shadowRoot.querySelector("c-lwc-card").querySelector("c-lwc-card-footer-link").shadowRoot.querySelector("button").click();
                    await sleep(1000);
                    console.log(`loaded ${loadedBadges} of  ${badgeCount}`);
                    loadedBadges = document.querySelector("c-lwc-trailhead-badges").shadowRoot.querySelector("c-lwc-card div").children.length;
                }
            }
                        
            var getBadgeDetails = function(){
                var badgeList = [];
                var badgeComponents = document.querySelector("c-lwc-trailhead-badges").shadowRoot.querySelector("c-lwc-card div").children;
                for(var badge of badgeComponents){
                    badgeList.push({
                        id: badge.$$OwnKey$$, 
                        completed_at: badge.awardedOn,
                        icon_url: badge.imageUrl,
                        path: badge.learningUrl,
                        points: badge.pointsAwarded,
                        title: badge.title,
                        type: badge.AwardType,
                        api_name: badge.$$OwnKey$$
                    });
                }
                return badgeList;
            }
            
            var getProfile = function(badges) {
                console.log("getting profile");
                var uid = app.get("v.uid");
                var profileUser = app.get("v.profileUser");

                return {
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
            };
         
            var loadDetails = async function(){
                    await loadBadges();
                    var badgeList = getBadgeDetails();
                    var profile = getProfile(badgeList);
                    
                    return profile;
            }
            //return loadDetails();
            var output = await loadDetails();
            console.log("success!!  " + JSON.stringify(output));

            return output;
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
                        let browserResults = await self.extractProfileDetails(page);
                        await browser.close();
                        resolve(browserResults);  
                    }catch(err){
                        console.log(err);
                        await browser.close();
                        reject(err);
                    }
            })
        })
    }
}