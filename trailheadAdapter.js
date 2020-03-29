"use strict";
const puppeteer = require('puppeteer');

module.exports = class TrailheadAdapter {
    async extractProfileDetails(page){
        let results = await page.evaluate(async() => {
            const badgeRetries = 4;
            const badgeRetryTime = 1000;

            const profileRetries = 4;
            const profileRetryTime = 1000;

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function loadMoreBadges(currentRetries){
                if(currentRetries > badgeRetries){
                    return;
                }
                currentRetries = currentRetries +1;
                try {
                    document
                        .querySelector("c-lwc-trailhead-badges").shadowRoot
                        .querySelector("c-lwc-card")
                        .querySelector("c-lwc-card-footer-link").shadowRoot
                        .querySelector("button").click();
                    return;
                } catch (error) {
                    await sleep(badgeRetryTime);
                    loadMoreBadges(currentRetries);
                }
            }

            function getBadgeCount(){
                try {
                    return parseInt(
                                document
                                    .querySelector("c-trailhead-rank").shadowRoot
                                    .querySelector("c-lwc-card").shadowRoot
                                    .querySelector("div > slot").assignedNodes()[1]
                                    .querySelector("c-lwc-tally:nth-child(1)").shadowRoot
                                    .querySelector("span > span.tds-tally__count.tds-tally__count_success")
                                    .textContent.trim()
                            );
                } catch (error) {
                    return  0;
                } 
            }

            async function loadBadges(){
                var badgeCount = getBadgeCount()
                console.log(`Loading Badges: Profile has ${badgeCount} total badges. `);
                if(badgeCount == 0){return;}
                var loadedBadges = 
                        document
                            .querySelector("c-lwc-trailhead-badges").shadowRoot
                            .querySelector("c-lwc-card div")
                            .children.length;
                while( loadedBadges < badgeCount){
                    await loadMoreBadges(0);
                    loadedBadges = 
                        document
                            .querySelector("c-lwc-trailhead-badges")
                            .shadowRoot.querySelector("c-lwc-card div")
                            .children.length;
                    console.log(`Loaded ${loadedBadges} of  ${badgeCount} badges.`);
                }
            }
            
            var getBadgeDetails = function(){
                var badgeCount = getBadgeCount()
                var badgeList = [];
                if(badgeCount == 0){return badgeList;}
                var badgeComponents = document.querySelector("c-lwc-trailhead-badges").shadowRoot.querySelector("c-lwc-card div").children;
                for(var badge of badgeComponents){
                    badgeList.push({
                        id: badge.$$OwnKey$$, 
                        icon_url: badge.imageUrl,
                        path: badge.learningUrl,
                        title: badge.title,

                        points: badge.pointsAwarded,        // only available if authenticated as user or by intercepting network traffic 
                        completed_at: badge.awardedOn,      // only available if authenticated as user or by intercepting network traffic 
                        type: badge.AwardType,              // only available by intercepting network traffic 
                        api_name: badge.$$OwnKey$$ + ""     // only available by intercepting network traffic 
                    });
                }
                return badgeList;
            }

            

            var getTrailheadSummary = function(){
                var progressResults = {
                 points : 0,
                 trails : 0,
                 rankImage : "",
                 rank : ""
                }
                var trailheadCard = 
                    document.querySelector("c-trailhead-rank");
                if(trailheadCard === null){
                    return progressResults;
                }
                
                progressResults.points = (() => {
                    try{
                        return document
                        .querySelector("c-trailhead-rank").shadowRoot
                        .querySelector("c-lwc-card").shadowRoot
                        .querySelector("div > slot").assignedNodes()[1]
                        .querySelector("c-lwc-tally:nth-child(2)").shadowRoot
                        .querySelector("span > span.tds-tally__count.tds-tally__count_success")
                        .textContent
                        .replace(",", "");
                    }catch(error){
                        return 0;
                    }
                }).call(this);

                progressResults.trails = (() => { 
                    try {
                        return document
                                .querySelector("c-trailhead-rank").shadowRoot
                                .querySelector("c-lwc-card").shadowRoot
                                .querySelector("div > slot").assignedNodes()[1]
                                .querySelector("c-lwc-tally:nth-child(3)").shadowRoot
                                .querySelector("span > span.tds-tally__count.tds-tally__count_success")
                                .textContent;
                    } catch (error) {
                        return 0;
                    }
                }).call(this);

                progressResults.rankImage = (() => {
                    try {
                        return document
                                .querySelector("c-trailhead-rank").shadowRoot
                                .querySelector("c-lwc-card").shadowRoot
                                .querySelector("div > slot").assignedNodes()[0]
                                .querySelector("img")
                                .getAttribute("src");
                    } catch (error) {
                        return "";
                    }
                }).call(this);

                progressResults.rank = (() => {try {
                    return document
                            .querySelector("c-trailhead-rank").shadowRoot
                            .querySelector("c-lwc-card").shadowRoot
                            .querySelector("div > slot").assignedNodes()[0]
                            .querySelector("img")
                            .getAttribute("alt");
                } catch (error) {
                    return "";
                }}).call(this);

                return progressResults;
            }
            
            var getProfile = function(badges) {
                var profileUser     = app.get("v.profileUser");
                var profilePhoto    = app.get("v.profilePhotoUrl");
                var profileUrl;
                
                /*
                    other variables:
                    v.identity      = availabled to logged in user
                    v.featureFlags  = nothing interesting
                */
                var profileUrlElement = document
                                            .querySelector(
                                                "#lightning > div > div > div.main > div > div.slds-container_x-large.slds-container_center.profile-content > div > div > div > div:nth-child(1) > article > div > div.slds-grid.slds-wrap.slds-grid_vertical-align-center.slds-grid_align-spread > div > a"
                                            );

                profileUrl = (profileUrlElement !== null) ? profileUrlElement.getAttribute("href") : `https://trailblazer.me/id?uid=${profileUser.TrailblazerId__c}&cmty=trailhead` ;
                
                var trailHeadSummary = getTrailheadSummary();

                return {
                    trailblazerId: profileUser.Id,
                    profileShortcutUrl: profileUrl,
                    profileUrl: profileUrl,
                    are_badges_public: profileUser.Is_Public_Profile__c,  
                    bio: profileUser.AboutMe,  
                    company: profileUser.CompanyName, 
                    // created_at: null,
                    facebook: profileUser.FacebookProfileLink__c,
                    // favorite_badge: null,
                    // favorite_character: null,
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
                    //th_sfid: uid, 
                    twitter: profileUser.TwitterProfileLink__c,  
                    website_url: profileUser.Company_Website__c,  
                    work_info: profileUser.CompanyName,  
                    userPath: "/id/" + profileUser.TrailblazerId__c, 
                    badges: badges,
                    badgeCount: badges.length,
                    points: trailHeadSummary.points,
                    trails: trailHeadSummary.trails,
                    rankImage: trailHeadSummary.rankImage,
                    rank: trailHeadSummary.rank,
                    avatarImage: profilePhoto
                };
            };

            async function getProfileSafely(badgeList,currentRetries,errorList){
                if(currentRetries > profileRetries){
                    throw new Error(`Encountered error while getting profile information  after: ${currentRetries} errors encountered: ${errorList}`)
                }
                currentRetries = currentRetries +1;
                try {
                    return await getProfile(badgeList);
                } catch (error) {
                    console.log(error);
                    errorList.push(error);
                    await sleep(profileRetryTime * currentRetries);
                    await getProfileSafely(badgeList,currentRetries,errorList);
                }
            }
            
            var loadDetails = async function(){
                await loadBadges();
                var badgeList = getBadgeDetails();
                var profile = await getProfileSafely(badgeList,0,[]);
                return profile;
            }
            
            var output = await loadDetails();
            console.log(`Successfully loaded profile for: ${output.full_name}`);
            return output;
        });
        return results;
    }

    getProfileInfo(url){
        var self = this;

        return new Promise(function(resolve,reject){
            puppeteer
                .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] , defaultViewport: { width:1920, height:1080 }}, ) //when debugging add attributes these attributes to see brower in action : devtools: true, headless:false,
                .then(async browser => {
                    try{
                        console.log(`starting browser and visiting:${url}`);
                        let page = await browser.newPage();
                        await page.on('console', msg => console.log(msg.text()));
                        await page.goto(url, {waitUntil: 'networkidle0'});
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