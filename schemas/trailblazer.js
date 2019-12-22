var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var trailblazerRequestSchema = new Schema(
    {
        schemaVersion: String,
        trailblazerRequestId: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        profileUrl: String,
        successfullyParsed: Boolean,
    },
    {
        timestamps: {
            createdAt: 'dateCreated',
            updatedAt: 'dateUpdated'
        }
    }
);

var trailblazerSchema = new Schema(
    {
        schemaVersion: String,
        trailblazerId: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        url: String,

        profileShortcutUrl: String,
        profileUrl: String,
        are_badges_public: Boolean,
        bio: String,
        company: String,
        created_at: Date,
        facebook: String,
        favorite_badge: String,
        favorite_character: String,
        favorite_park: String,
        favorite_team: String,
        favorite_tunes: String,
        first_name: String,
        full_name: String,
        google: String,
        job_role: String,
        job_title: String,
        last_name: String,
        level: String,
        linkedin: String,
        relation: String,
        slug: String,
        th_sfid: String,
        twitter: String,
        website_url: String,
        work_info: String,
        userPath: String,

        badgeCount: Number,
        points: Number,
        trails: Number,
        rankImage: String,
        rank: String,
        avatarImage: String,

        statsHistory: [{
            badgeCount: Number,
            points: Number,
            trails: Number,
            rankImage: String,
            rank: String,
            refreshed: { type: Date, default: Date.now },
        }],

        badges: [{
            id: String,
            api_name: String,
            badge_type: String,
            completed_at: Date,
            created_at: Date,
            drm_last_sync_attempt: Date,
            drm_synced: Boolean,
            employee: Boolean,
            facebook_share: String,
            finished_at: Date,
            google_share: {
                calltoactionurl: String,
                clientid: String,
                contenturl: String,
                cookiepolicy: String,
                prefilltext: String
            },
            icon_url: String,
            last_attempted_at: Date,
            linkedin_share: String,
            path: String,
            points: Number,
            private: Boolean,
            progress: Number,
            state: String,
            tags: [String],
            terms_accepted_at: String,
            terms_version: String,
            title: String,
            twitter_share: String,
            type: {type:String},
            updated_at: Date,
            user_id: Number,
            remote_badge_key: String,
        }]
    },
    {
        timestamps: {
            createdAt: 'dateCreated',
            updatedAt: 'dateUpdated'
        }
    }
)

module.exports = {
    TrailblazerSchema : trailblazerSchema,
    TrailblazerRequestSchema : trailblazerRequestSchema
}