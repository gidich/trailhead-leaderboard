(function () {
    'use strict';
 }());

var mongoose = require('mongoose');
var Schemas = require('../schemas/trailblazer');

module.exports = class TrailblazerModelFactory{
    constructor(){
        this.TrablazerModel = mongoose.model('trailblazer',Schemas.TrailblazerSchema,'trailblazers');
    }
    getNew(){
        return new this.TrablazerModel({schemaVersion:'0.0.1'});
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
    save(model){
        var self = this;
        return new Promise(function(resolve,reject){
            try{
                var statsHistory = model.statsHistory || [];
                statsHistory.push({
                    badgeCount: model.badgeCount,
                    points: model.points,
                    trails: model.trails,
                    rankImage: model.rankImage,
                    rank:model.rank
                });
                model.statsHistory = statsHistory;
                delete model._doc._id;
                self.TrablazerModel.findOneAndUpdate(
                    {
                        'trailblazerId':model.trailblazerId
                    },
                    model,
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
               var q = self.TrablazerModel.findOne({trailblazerId:trailblazerId});
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
    /*
    getById(id){
        var self = this;
        return new Promise(function(resolve,reject){
            try{
                self.TrablazerModel.findOne({tailblazerId:id}, function(err,results){
                    if(err) {
                        console.log('error')
                        console.log(err)
                        reject(err);
                    }
                    resolve(results);
                });
            }catch(err){
                reject(err);
            }
        });
    }
    */
    listAll(){
        try{
            return this.TrablazerModel.find({})
        } catch(err){
            throw err;
        }
    }
}