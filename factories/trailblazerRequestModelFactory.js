(function () {
    'use strict';
 }());

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
mongoose.set('useFindAndModify', false);
var Schemas = require('../schemas/trailblazer');

module.exports = class TrailblazerModelFactory{
    constructor(){
        this.Model = mongoose.model('trailblazerRequest',Schemas.TrailblazerRequestSchema,'trailblazerRequests');
    }
    getNew(){
        return new this.Model(
            {
                schemaVersion:'0.0.1', 
                trailblazerRequestId: ObjectId()
            });
    }
    aggregate(aggreggations){
        var self = this;
        return new Promise(function(resolve,reject){
            try {
                var q = self.Model.aggregate(aggreggations);
                q.allowDiskUse(true);  
                q.exec(
                    function(err,results){
                        if(err) {
                            console.log('error')
                            console.log(err)
                            reject(err);
                        }
                        resolve(results);
                    }
                )
            } catch (err) {
                console.log('error');
                reject(err);
            }
        });
    }
    find(filters,columns,options){
        var self = this;
        return new Promise(function(resolve,reject){
            try {
               var q = self.Model.find(filters,columns,options);
               q.exec(
                    function(err,results){
                        if(err) {
                            console.log('error')
                            console.log(err)
                            reject(err);
                        }
                        resolve(results);
                    }
               );
            } catch (err) {
                console.log('error');
                reject(err);
            }
        })
    }
    leanFind(filters,columns,options){
        var self = this;
        return new Promise(function(resolve,reject){
            try {
               var q = self.Model.find(filters,columns,options);
               q.lean()
               q.exec(
                    function(err,results){
                        if(err) {
                            console.log('error')
                            console.log(err)
                            reject(err);
                        }
                        resolve(results);
                    }
               );
            } catch (err) {
                console.log('error');
                reject(err);
            }
        })
    }
    set(model){
        var self = this;
        return new Promise(function(resolve,reject){
            try{
                self.Model.findOneAndUpdate(
                    {
                        'trailblazerRequestId':model.trailblazerRequestId
                    },
                    {
                        $set: model
                    },
                    {
                        upsert:true,
                        new:true,
                        runValidators:true,
                        setDefaultsOnInsert:true
                    },
                    function(err,results){
                        if(err) {
                            console.log('error')
                            console.log(err)
                            reject(err);
                        }
                    console.log("Successfully Saved Profile")
                    resolve(results);
                });
            }catch(err){
                reject(err);
            }
        });
    }
    getById(trailblazerId){
        var self = this;
        return new Promise(function(resolve,reject){
            try {
               var q = self.Model.findOne({trailblazerId:String(trailblazerId)});
               q.exec(
                    function(err,results){
                        if(err) {
                            console.log('error')
                            console.log(err)
                            reject(err);
                        }
                        resolve(results !== null ? results : self.getNew());
                    }
               );
            } catch (err) {
                console.log('error');
                reject(err);
            }
        })
    }
    listAll(){
        try{
            return this.Model.find({})
        } catch(err){
            console.error(err);
            throw err;
        }
    }
}