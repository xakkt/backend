const Company = require('../../models/company');
const { validationResult } = require('express-validator');


exports.create = async (req, res) => {
    try {
        res.render('admin/company/create', { menu: "company", submenu: "create" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
}
exports.save = async (req, res) => {
    try {
        const compinfo = {
            name: req.body.name,
            address: req.body.address,
            contact: req.body.contact,
            email: req.body.email,
            description: req.body.description
        }
        const company = await Company.create(compinfo)
        if (!company) return res.json({ status: false, message: "Data not saved" })
        req.flash('success', 'Company added successfully!');
        res.redirect('/admin/company/list')
        // return res.json({ status: true, data: company })
    } catch (err) {
        console.log("errr",err)
        return res.status(404).json({ status: false, message: err })

    }
}
exports.list = async (req, res) => {
    try {
        const company = await Company.find().lean()
        if (!company) return res.render('admin/company/listing', { menu: "company", submenu: "list", data: "",success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure')  })
        return res.render('admin/company/listing', { menu: "company", submenu: "list", data: company,success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure')  })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });

    }

}
exports.delete =  (req,res) =>{
    Company.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.status(400).json({ data: err });
        req.flash('success', 'Company deleted successfully!');
        res.redirect('/admin/company/list')
    });  

}
exports.edit = async (req,res) =>{
    try {
        const company = await Company.findById(req.params.id).exec();
        res.render('admin/company/edit', { status:true, data:company, menu: "company", submenu: "create" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
}
exports.update = async(req,res) =>{
    try {
        const compinfo = {
            // name: req.body.name,
            address: req.body.address,
            contact: req.body.contact,
            // email: req.body.email,
            description: req.body.description
        }
        const company = await Company.findOneAndUpdate(req.params.id,compinfo,{returnOriginal: false}).lean()
        if(!company) return res.render('admin/company/listing',{menu:"company",submenu:"list" ,success: await req.consumeFlash('success'),data:"", failure: await req.consumeFlash('failure') })
         return  res.redirect('/admin/company/list')

        //  return res.render('admin/company/listing', { status:true, data:company, menu: "company", submenu: "create",success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure')  })
    } catch (err) {
        console.log("---logs",err)
        res.status(400).json({ status: "false", data: err });
    }
}