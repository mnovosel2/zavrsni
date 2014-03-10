exports.listAllDocuments=function(req,res,next){
	req.documents.find({},function(error,docs){
		if(error)
			return next(new Error('Pogreska u dohvacanju liste dokumenata'));
		else{
			res.render('documents',{
				document_list:docs||[]
			});
		}
	});
}
exports.createDocument=function(req,res,next){
		var title=req.body.title,
			tags=req.body.tags,
			type=req.body.type,
			content=req.body.content,
			dateCreated=req.body.dateCreated,
			location=req.body.location;
		if(!title || !tags || !type)
			return next(new Error("Unos nije validan zbog nedovoljno podataka"));
		new req.documents({
			title:title,
			tags:tags,
			type:type,
			content:content,
			dateCreated:dateCreated,
			location:location
		}).save(function(err,docs){
			if(err){
				console.log('Spremanje nije uspjelo');
			}else{
				res.redirect(200,'/documents');
			}
		});
}