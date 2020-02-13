const express = require('express');
const app = express();
var cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// CORS header securiy
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

 // connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ang_node_api'
});
 
// connect to database
mc.connect();

app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
 
 // Retrieve all todos 
app.get('/users', function (req, res) {
    mc.query('SELECT * FROM content', function (error, results, fields) {
        if (error) throw error;
        return res.send({ results });
    });
});

app.get('/articles', function (req, res) {
      res.set({ 'content-type': 'application/json;charset=utf-8' });
        return res.json([
    {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse kalees",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  }
  ]);
    });
//Retrieve user  with id 
app.get('/users/:id', function (req, res) {
 
    let task_id = req.params.id;
 
    if (!task_id) {
        return res.status(400).send({ error: true, message: 'Please provide task_id' });
    }
 
    mc.query('SELECT * FROM content where id=?', task_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Todos list.' });
    });
 
});

// Search for todos with ‘bug’ in their name
app.get('/users/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM content WHERE title LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos search list.' });
    });
});

app.post('/users', function (req, res) {
	  var title = req.body.title;
	    var category = req.body.category;
		var userId = 1;
		 var post  = {title: req.body.title, category:req.body.category,userId:1 };
		var query = mc.query('INSERT INTO content SET ?', post, function(err, result) {
   // Neat!
 });
    res.send('POST Request received'+ title + category);
});

/*app.put('/users', function (req, res) {
	
	 var post  = {title: req.body.title, category:req.body.category };
	 
    res.send('PUT Request');

});*/
app.put('/users/:id', function (req, res) {
	
	let task_id = req.params.id;
	var title = req.body.title;
	var category = req.body.category;
    if (!task_id) {
        return res.status(400).send({ error: true, message: 'Please provide task_id' });
    }
	//var post  = {title: req.body.title, category:req.body.category,id:task_id };
//	var post  = {title: req.body.title, category:req.body.category,id:task_id };
	//var post  = {title: 'eswar', category:'123',id:2 };
	var post  = [req.body.title,req.body.category,task_id];
	// var post = ['kk','ii',1];
	/* console.log(task_id);
	console.log(req.body.title);
	console.log(req.body.category); */
	console.log(post);
   
	var query = mc.query('UPDATE content SET title = ? , category = ? where id = ?', post, function(err, result) {
   // Neat!
 });
    res.send('PUT Request custom');

});
app.get('/users/delete/:id', function (req, res) {
	let id = req.params.id;
	var query = mc.query('DELETE FROM content WHERE id = ?',id,function(err, result) {
   // Neat!
 });
    res.send('delete Request');

});
app.post('/users/edit', function (req, res) {
    res.send('PUT Request');
	
});

app.post('/users/delete', function (req, res) {
	var id = req.body.userid;
	var query = mc.query('DELETE FROM content WHERE id = ?',id,function(err, result) {
   // Neat!
 });
 
 var originsWhitelist = [
  'http://localhost:4200'      //this is my front-end url for developmen
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}
//here is the magic
app.use(cors(corsOptions));


 mc.connect(function(err) {
  if (err) throw err;
  //Delete all customers with the address "Mountain 21":
  var sql = "DELETE FROM content WHERE id = "+id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});
   // res.send('DELETE Request');
	 res.send('POST Request received'+ id);
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
//app.listen(8080, function () {
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});