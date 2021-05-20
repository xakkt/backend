const Currency = require('../../models/currency');

exports.save = async (req, res) => {
    try {
        console.log("--req",req.body)
        let store = await Currency.create(req.body);
        res.render('admin/currency/list', { menu: "currency", submenu: "list", store: store })
    } catch (err) {
        console.log("----err",err)
        res.status(400).json({ status: "false", data: err });
    }
}
exports.create = async (req, res) => {
    try {
        res.render('admin/currency/create', { menu: "currency", submenu: "create", currency: '' })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
},
exports.listing = async (req, res) => {
    try {
        let currency = await Currency.find({}).exec();
       
        if(!currency.length) return res.render('admin/currency/listing', { menu: "currency", submenu: "list", currency: "", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        return res.render('admin/currency/listing', { menu: "currency", submenu: "list", currency: currency, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
      
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
}