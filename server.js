var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var app = express();

app.use(bodyParser());

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index',{})
});

var elastic = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

app.post('/saveUser', function (req, res) {
    var user = new User({
        name : req.body.name,
        email : req.body.email,
        username : req.body.username
    });
    user.save(function (err) {
        if (err) throw err;
        console.log('User saved successfully');
        res.json({
            success: true
        });
    });
});

app.post('/search', function (req, res) {
     elastic.search({
      index: 'users',
      type: 'user',
      body: {
        query: {
          fuzzy: {
             _all: req.body.searchterm
          }
        }
      }
  }).then(function(response) {
      var success = response.hits.hits;
      console.log("Got a Hit!");
      res.send(success);
  }, function(error) {
      console.trace(error.message);
      res.send(404);
  });
});

app.listen(3000);
console.log('server started 3000')
