exports.hashPassword=function(req,res,next){
	var rand=Math.random();
	var salt=req.users.email+'#'+rand;
	var encPassword=req.crypto.createHmac('sha1',salt);
	encPassword.setEncoding('hex');
	encPassword.write(req.users.password);
	encPassword.end();

	//encPassword.read();
}