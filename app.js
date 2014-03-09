
var express = require('express'),
 	routes = require('./routes'),
 	http = require('http'),
 	path = require('path'),
 	mongoose=require('mongoose'),
	app = express();

//Database setup
var db=mongoose.connect('mongodb://localhost/zavrsniDB');
var documentSchema=new mongoose.Schema({
		title:String,
		content:String,
		tags:String,
		dateCreated:{
				type: Date,
				default: Date.now
		}
});
var documents=mongoose.model('documents',documentSchema);
app.use(function(req,res,next){
	req.documents=documents;
	next();
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')(path.join(__dirname, '/public'),{compress:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
