/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
const mongooseConfig = require("../config/mongoose_config");
var mongo = require('mongodb');
var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const Library = require("./library")

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

mongoose.connect(MONGODB_CONNECTION_STRING, mongooseConfig)
var db = mongoose.connection;

module.exports = function (app) {
  
  app.route('/api/books')
    .get(function (req, res){
    
    // Library.aggregate(
    // {$project: {comments: 1, title: 1}},
    // {$unwind: "$comments"},
    // {$group: {_id: "$_id", title: "$title", count: {$sum:1}}}
    // )
      
    
      Library.find({}, function(err, alldata) {
        if (alldata) {
          return res.send(alldata)
        } else {
          return 
        }
      })

    //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      var library = new Library()
      
      var title = req.body.title
      
      if (!title) {
        return res.send('Missing title')        
      } else {
        library.title = title 
        library.save(function(err, data) {
          if (err) {
            return res.send("Cloud not save")
          } 
          res.json({"title": data.title, "comments": data.comments, "_id":data._id})
    })}
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
    
      Library.deleteMany({}, function(err, alldata) {
        if (err) {
          return res.send("Could not delete")
        } 
        return res.send("Deleted successful")
      })
    
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Library.findById(bookid, function(err, data) {
        if (err) {
          console.log('could not find')
          res.send('could not find')
        } else {
          res.json({"_id":data._id, "title": data.title, "comments": data.comments})
        }
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      
      var library = new Library();
      // Library.findByIdAndUpdate(bookid, {$push: {"comments": comment}, $inc: {"commentcount": 1}}, function(err, data) {
      //   if (err) {
      //     console.log('could not find')
      //     res.send('could not find')          
      //   } else if (!comment) {
      //     res.send('Missing comment')
      //   } 
      // })
    
      Library.findById(bookid, (err, data) => {
        if(err || !data) {
          return res.send('could not find');
        }

        if(comment) {
          data.comments.push(comment);
          data.commentcount++;
        }

        data.save(err => {
          if (err) { 
            return res.send('could not add comment');
          }
          return res.json(data);
        })
      });      
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      
      Library.findById(bookid, function(err, data) {
        if (err) {
          console.log('failed delete');
          res.send("could not delete" + data._id);
        } else {
          console.log("Deleted");
          res.send("complete delete successful");
        }
      })
    
      //if successful response will be 'delete successful'
    });
  
};
