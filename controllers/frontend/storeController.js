const Department = require('../../models/department');
const Store = require('../../models/store');


exports.list = async (req, res) => {
  console.log("---session",req.session.customer)
  let store =   await Store.find().lean();
   if(store) return res.render('frontend/store',{data:req.session.customer,store:store})

   
}