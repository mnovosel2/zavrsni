
var express = require('express'),
 	routes = require('./routes'),
 	docs=require('./routes/docs'),
 	settings=require('./config/settings.json'),
 	http = require('http'),
 	crypto=require('crypto'),
 	path = require('path'),
 	mongoose=require('mongoose'),
 	MongoStore=require('connect-mongo')(express),
	app = express();

//Database setup
var db=mongoose.connect(settings.url);
var documentSchema=new mongoose.Schema({
		title:String,
		content:String,
		tags:String,
		dateCreated:{
				type: Date,
				default: Date.now
		},
		type:String,
		user_id:String
});
var userSchema=new mongoose.Schema({
	username:String,
	password:String,
	email:String,
	dateRegistered:Date
});
var documents=mongoose.model('documents',documentSchema);
var users=mongoose.model('users',userSchema);
app.use(function(req,res,next){
	req.documents=documents;
	next();
});
app.use(function(req,res,next){
	req.users=users;
	next();
});
app.use(function(req,res,next){
	req.crypto=crypto;
	next();
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({
		secret:settings.secret,
		mongoose_connection:db.connections[0],
		store:new MongoStore({
			db:settings.db
		})
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')(path.join(__dirname, '/public'),{compress:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.param('document_id',function(req,res,next,document_id){
		req.documents.findById(document_id,function(err,docs){
				if(err)
					return next(new Error('Dokument nije pronaden'));
				req.doc=docs;
				return next();
		});
});


app.get('/', docs.listAllDocuments);
app.get('/documents/:document_id/edit',docs.editForm);
app.put('/documents/:document_id/edit',docs.updateDocument);
app.get('/documents/:document_id/new',docs.createForm);
app.post('/documents/:document_id/new',docs.createDocument);
app.get('/documents/:document_id/delete',docs.deleteForm);
app.del('/documents/:document_id/delete',docs.deleteDocument);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
