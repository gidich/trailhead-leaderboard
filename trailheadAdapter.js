"use strict";
const puppeteer = require('puppeteer');

module.exports = class TrailheadAdapter {
    async extractProfileDetails(page){
        let results = await page.evaluate(() => {

            var reactProfile = JSON.parse($('div[data-react-class="profile/AboutMe"]').first().attr('data-react-props'));;
            var reactBadges = JSON.parse($('div[data-react-class=BadgesPanel]').first().attr('data-react-props'));
            
            var badges = [];
            reactBadges.badges.forEach(badge => {
                var google_share;
                if(badge.google_share){
                    google_share = {
                        calltoactionurl: badge.google_share.calltoactionurl ,
                        clientid: badge.google_share.clientid,
                        contenturl: badge.google_share.contenturl,
                        cookiepolicy: badge.google_share.cookiepolicy,
                        prefilltext: badge.google_share.prefilltext
                    }
                }

                badges.push({
                    id: badge.id,
                    api_name: badge.api_name,
                    badge_type: badge.badge_type,
                    completed_at: badge.completed_at,
                    created_at: badge.created_at,
                    drm_last_sync_attempt: badge.drm_last_sync_attempt,
                    drm_synced: badge.drm_synced,
                    employee: badge.employee,
                    facebook_share: badge.facebook_share,
                    finished_at: badge.finished_at,
                    google_share: google_share,
                    icon_url: badge.icon_url,
                    last_attempted_at: badge.last_attempted_at,
                    linkedin_share: badge.linkedin_share,
                    path: badge.path,
                    points: badge.points,
                    private: badge.private,
                    progress: badge.progress,
                    state: badge.state,
                    tags: badge.tags,
                    terms_accepted_at: badge.terms_accepted_at,
                    terms_version: badge.terms_version,
                    title: badge.title,
                    twitter_share: badge.twitter_share,
                    type: badge.type,
                    updated_at: badge.updated_at,
                    user_id: badge.user_id,
                    remote_badge_key: badge.remote_badge_key,
                })
            });

            var results = {
                trailblazerId: reactProfile.userPath.split('/').pop(),
                profileShortcutUrl: reactProfile.profileShortcutUrl,
                profileUrl: reactProfile.profileUrl,
                are_badges_public: reactProfile.user.are_badges_public,
                bio: reactProfile.user.bio,
                company: reactProfile.user.company,
                created_at: reactProfile.user.created_at,
                facebook: reactProfile.user.facebook,
                favorite_badge: reactProfile.user.favorite_badge,
                favorite_character: reactProfile.user.favorite_character,
                favorite_park: reactProfile.user.favorite_park,
                favorite_team: reactProfile.user.favorite_team,
                favorite_tunes: reactProfile.user.favorite_tunes,
                first_name: reactProfile.user.first_name,
                full_name: reactProfile.user.full_name,
                google: reactProfile.user.google,
                job_role: reactProfile.user.job_role,
                job_title: reactProfile.user.job_title,
                last_name: reactProfile.user.last_name,
                level: reactProfile.user.level,
                linkedin: reactProfile.user.linkedin,
                relation: reactProfile.user.relation,
                slug: reactProfile.user.slug,
                th_sfid: reactProfile.user.th_sfid,
                twitter: reactProfile.user.twitter,
                website_url: reactProfile.user.website_url,
                work_info: reactProfile.user.work_info,
                userPath: reactProfile.userPath,
                badges: badges,

                badgeCount: $('.user-information__achievements-data[data-test-badges-count]').first().text().trim(),
                points: $('.user-information__achievements-data[data-test-points-count]').first().text().trim().replace(',',''),
                trails: $('.user-information__achievements-data[data-test-trails-count]').first().text().trim(),
                rankImage: 'https://trailhead.salesforce.com' + $('.slds-show[data-test-current-rank]').first().find('img').attr('src').trim(),
                rank: $('.slds-show[data-test-current-rank]').first().find('img').attr('alt').trim(),
                avatarImage: $('img.user-information__avatar-img').first().attr('src').trim(),
            }
            return Promise.resolve(results);
        });
        return results;
    }

    getProfileInfo(url){
        var self = this;
        return new Promise(function(resolve,reject){
            puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => {
                try{
                    console.log(`starting browser and visiting:${url}`);
                    let page = await browser.newPage();
                    await page.setViewport({width:1920, height:1080});
                    await page.goto(url, {waitUntil: 'networkidle0'});
                    await page.waitFor(".user-profile").then(() => console.log('found user profile'));
                    let results = await self.extractProfileDetails(page);
                    resolve(results);  
                }catch(err){
                    console.log(err);
                    reject(err);
                }
            })
        })
    }
}