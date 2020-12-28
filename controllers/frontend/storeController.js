const Department = require('../../models/department');
const Store = require('../../models/store');


exports.list = async (req, res) => {
  let store =   await Store.find().lean();
   if(store) return res.render('frontend/store',{data:store})

   
}