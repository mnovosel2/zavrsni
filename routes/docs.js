exports.listAllDocuments=function(req,res,next){
	req.documents.find({},function(error,docs){
		if(error)
			return next(new Error('Pogreska u dohvacanju liste dokumenata'));
		else{
			req.session.test="test session";
			res.render('index',{
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
			user_id=req.body.user_id;
		if(!title || !tags || !content)
			return next(new Error("Unos nije validan zbog nedovoljno podataka"));
		new req.documents({
			title:title,
			tags:tags,
			type:type,
			content:content,
			dateCreated:Date.now(),
			user_id:user_id
		}).save(function(err,docs){
			if(err){
				return next(new Error("Spremanje nije uspjelo"));
			}else{
				res.redirect('/');
			}
		});
}
exports.editForm=function(req,res){
	res.render('editForm',{
		doc:req.doc || []
	});
}
exports.updateDocument=function(req,res){
	req.documents.findByIdAndUpdate(req.body.document_id,{
		$set:{
			title:req.body.title,
			content:req.body.content,
			tags:req.body.tags
		}
	},{new:true},function(err,docs,next){
		if(err)
			return next(new Error("Azuriranje nije uspjesno"));
		res.redirect('/');
	});
}
exports.createForm=function(req,res){
	res.render("createForm",{
		doc:req.doc||[]
	});
}
exports.deleteForm=function(req,res){
	res.render('deleteForm',{
		doc:req.doc||[]
	});
}

exports.deleteDocument=function(req,res){
	req.documents.findByIdAndRemove(req.doc._id,function(err,docs){
		if(err)
			return next(new Error('Dokument nije moguce izbrisati'));
		res.redirect('/');
	});
}