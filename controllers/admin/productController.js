const productCategory = require('../../models/product_category');

exports.create = async(req, res) => { 
   
    try{
        const productcategory = {
          
           name:req.body.name,
           logo: req.file.filename,
           parent_id: req.body.parent_id,
        } 
        const product_category = await productCategory.create(categoryInfo);
	 res.json({status: "success", message: "Category added successfully", data: product_category});




    }catch(err) {
        res.status(400).json({data: err.message});

    }


}