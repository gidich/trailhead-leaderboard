var TrailblazerFactory = require('./factories/trailblazerModelFactory')
var TrailheadAdapter = require('./trailheadAdapter');
const dotenv = require('dotenv');
const dotenvConig = dotenv.config()
 
if (!dotenvConig.error) {
    console.log(dotenvConig.parsed);
}
 


const { Pool } = require('pg');
var mongoose = require('mongoose');

var trailblazerFactory = new TrailblazerFactory();
var trailheadAdapter = new TrailheadAdapter();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:true
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
});


function delay(){
    return new Promise(resolve => setTimeout(resolve,3000))
}

async function main() {

    try {
        var trailblazers = await trailblazerFactory.leanFind(
            {},
            ['full_name','profileUrl','trailblazerId'],
            {
                sort:{
                    badgeCount:-1
                },
                limit:5
            }
        );
        async function processTrailblazers(traiblazers){
            for(const trailblazer of traiblazers){
                try {
                 //   var results = await trailheadAdapter.getProfileInfo(trailblazer.profileUrl);
                   // await trailblazerFactory.set(results);
                    await delay();
                    console.log(`successfully updated profile information for :${trailblazer.full_name} at url:${trailblazer.profileUrl}`  );
                } catch (error) {
                    console.log(`encountered error while updating profile information for :${trailblazer.full_name} at url:${trailblazer.profileUrl} error: ${error}`  );
                }
            }
        
        }
        await processTrailblazers(trailblazers);
        return;
    } catch (error) {
        console.log(`encountered error while updating profile information for :${trailblazer.full_name} at url:${trailblazer.profileUrl} error: ${error}`  );
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
    });


