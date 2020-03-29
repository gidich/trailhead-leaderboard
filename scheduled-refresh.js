/* mongo db connection : begin */
const { Pool }          = require('pg');
var mongoose            = require('mongoose');
var TrailblazerFactory  = require('./factories/trailblazerModelFactory')
var TrailheadAdapter    = require('./trailheadAdapter');
const dotenv            = require('dotenv');
const dotenvConig       = dotenv.config()

var trailblazerFactory  = new TrailblazerFactory();
var trailheadAdapter    = new TrailheadAdapter();

if (!dotenvConig.error) {
    console.log(dotenvConig.parsed);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:true
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
});
/* mongo db connection : end */

const profileRetries        = 3;
const profileRetryWaitTime  = 1000;
const profileLoopDelay      = 3000;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadProfile(trailblazer, currentRetries,errorList){
    if(trailblazer.profileUrl === undefined){return;}
    if(currentRetries > profileRetries){
        throw new Error(`Encountered error while updating profile information for: ${trailblazer.full_name} at url: ${trailblazer.profileUrl} after: ${currentRetries} errors encounterd: ${errorList}`)
    }
    currentRetries = currentRetries +1;
    try {
        trailblazer.profileUrl = trailblazer.profileUrl == "" ? `https://trailblazer.me/id?uid=${trailblazer.trailblazerId}&cmty=trailhead` : trailblazer.profileUrl;
        var results = await trailheadAdapter.getProfileInfo(trailblazer.profileUrl);
        await trailblazerFactory.set(results);
        console.log(`Successfully updated profile information for :${trailblazer.full_name} at url: ${trailblazer.profileUrl}`);
        return;
    } catch (error) {
        errorList.push(error);
        await sleep(profileRetryWaitTime);
        loadProfile(trailblazer,currentRetries);
    }
}

async function processTrailblazers(traiblazers){
    for(const trailblazer of traiblazers){
        var errorList = [];
        try {
            console.log(`Attempting to refresh profile for: ${trailblazer.full_name}.`)
            await loadProfile(trailblazer,0,errorList);
        } catch (error) {
            console.log(error);
        }
        await sleep(profileLoopDelay);
    }
}


async function main() {
    try {
        var trailblazers = await trailblazerFactory.leanFind(
            {},
            ['full_name','profileUrl','trailblazerId'],
            {
                sort:{
                    dateUpdated:1
                }//,
                //limit:2
            }
        );
        await processTrailblazers(trailblazers);
        return;
    } catch (error) {
        console.log(`Encountered error while updating profile information for: ${trailblazer.full_name} at url: ${trailblazer.profileUrl} error: ${error}`  );
        return;
    }   
}

main()
    .then(() => {
        console.log('completed');
        process.exit(0);
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });