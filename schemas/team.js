var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var teamSchema = new Schema(
    {
        schemaVersion: String,
        teamName: {
            type: String,
            required: true,
            index: true,
            unique: true
        }
    },
    {
        timestamps: {
            createdAt: 'dateCreated',
            updatedAt: 'dateUpdated'
        }
    }
)
