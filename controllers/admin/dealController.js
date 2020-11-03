const Deal = require('../../models/deal');
const { validationResult } = require('express-validator');

exports.create = async (req, res) => {
    try {
        res.render('admin/deals/create', { menu: "deals", submenu: "create" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
}
exports.save = async (req, res) => {
    console.log(req.body)
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dealinfo = {
            name: req.body.name,
            description: req.body.description,
        }

        // categoryInfo.parent_id = (req.body.parent_id) ? req.body.parent_id : null;

        const deal = await Deal.create(dealinfo);
        await req.flash('success', 'Deal added successfully!');
        res.redirect('/admin/deal')

    }catch(err){
        await req.flash('failure', err.message);
        res.redirect('/admin/deal')
        // res.status(400).json({ data: err.message });
    }


}
exports.listing = async (req, res) => {
    try {
        let deal = await Deal.find().exec();
        if (!deal.length) return res.render('admin/deals/listing', { menu: "deal", submenu: "list", deal: "", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        return res.render('admin/deals/listing', { menu: "deal", submenu: "list", deal: deal, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
    }catch(err){
        res.status(400).json({ data: err.message });
    }
}
exports.delete = async (req, res) => {
    Deal.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.status(400).json({ data: err });
        req.flash('success', 'Deal deleted successfully!');
        res.redirect('/admin/deal')
        //  return res.json({status:true, message: "Department Deleted", data:[]});
    });
}
exports.edit = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id).exec();
        res.render('admin/deals/edit', { status: "success", message: "", deal: deal, menu: "Deal", submenu: "edit" })
        // res.json({status: "success", message: "", data: departments});
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }


}
exports.update = async function (req, res) {

    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const dealinfo = {
            name: req.body.name,
            description: req.body.description,

        }
        const deal = await Deal.findByIdAndUpdate({ _id: req.params.id }, dealinfo, { new: true, upsert: true });
        if (deal) {
            await req.flash('success', 'Deal updated successfully!');
            res.redirect('/admin/deal')
        }
        return res.status(400).json({ status: false, message: "Deal not found" });

    } catch (err) {
        console.log(err)
        await req.flash('failure', err.message);
        res.redirect('/admin/deal')
        // res.status(400).json({status:false, message: "Not updated", data:err});
    }


}