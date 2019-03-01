(function () {
    'use strict';
 }());

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
var Schemas = require('../schemas/trailblazer');

module.exports = class TrailblazerModelFactory{
    constructor(){
        this.TrablazerModel = mongoose.model('trailblazer',Schemas.TrailblazerSchema,'trailblazers');
    }
    getNew(){
        return new this.TrablazerModel({schemaVersion:'0.0.1'});
    }
    aggregate(aggreggations){
        var self = this;
        return new Promise(function(resolve,reject){
            try {
                var q = self.TrablazerModel.aggregate(aggreggations);
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
               var q = self.TrablazerModel.find(filters,columns,options);
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
               
               var q = self.TrablazerModel.find(filters,columns,options);
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
                var newHistory = {
                    badgeCount: model.badgeCount,
                    points: model.points,
                    trails: model.trails,
                    rankImage: model.rankImage,
                    rank:model.rank
                };
                self.TrablazerModel.findOneAndUpdate(
                    {
                        'trailblazerId':model.trailblazerId
                    },
                    {
                        $set: model,
                        $push: {statsHistory:[newHistory]}
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
                    console.log("saved!")
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
               var q = self.TrablazerModel.findOne({trailblazerId:String(trailblazerId)});
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
            return this.TrablazerModel.find({})
        } catch(err){
            throw err;
        }
    }
}