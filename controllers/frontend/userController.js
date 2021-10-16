const User = require('../../models/user');
var randomstring = require("randomstring");
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var moment = require('moment');
const { validationResult } = require('express-validator');
const Device = require('../../models/device')
var md5 = require('md5');

const app = express();
var server = require('http').Server(app);

exports.addAddress = async (req, res) => {

	try {

		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		var address_array = [];
		address_array.push({
			address1: req.body.address1,
			address2: req.body.address2,
			city: req.body.city,
			address_type: req.body.address_type,
			//countrycode: req.body.countrycode,
			country: req.body.country,
			//region: req.body.region,
			phoneno: req.body.contact_no,
			zipcode: req.body.zipcode,
			emirate: req.body.emirate,
			//location: { type: "Point", coordinates: [req.body.long, req.body.lat] },
		})
		console.log("0--00000", address_array)

		let user = await User.findOneAndUpdate({ _id: req.session.userid }, { $push: { address: address_array } }, { returnOriginal: false }).exec()
		if(user.address.length==1){
			await User.update(
				{
				  _id: req.session.userid,
				  "address._id": user.address[0]._id
				},
				{ $set: { "address.$.is_default" : true } }
			 )
		}
		if (!user) return res.json({ status: 1, message: "Data not found" })
		res.redirect(req.header('Referer'));

	} catch (err) {
		console.log("--log", err)
		return res.status(404).json({ message: err.message })
	}
}
exports.addresslist = async (req, res) => {

	try {

		if(req.query.default){
			
			var defaultAddress = await User.findOne({_id:req.decoded.id},{ address: { $elemMatch: { is_default: req.query.default } } }).lean()
			if(!defaultAddress.address){ return res.json({ status: 0, message: "No default address added for you" }) }
			return res.json({data:defaultAddress}) 
		}

		let user = await User.findOne({ _id: req.decoded.id }, "contact_no email first_name last_name address").select('-_id').lean()
		// let user = await User.findOne({ _id: req.decoded.id }).select('-_id -password -role_id -coupons -last_login -updatedAt -createdAt -ncrStatus').lean()

		if (!user) return res.json({ status: 0, message: "Data not found" })
		return res.json({ state: 1, data: user })


	} catch (err) {
		console.log("--err", err)
		return res.status(404).json({ message: err.message })

	}

}
exports.deleteAddress = async (req, res) => {

	try {
		let user = await User.findOneAndUpdate({ _id: req.session.userid },
			{ $pull: { address: { _id: req.params.address } } },
			{ new: true }).lean()
		if (!user) return res.json({ status: 0, message: "Data not found" })
		res.redirect(req.header('Referer'));


	} catch (err) {
		return res.status(404).json({ message: err.message })

	}
}
exports.makeDefaultAddress = async(req, res)=>{
	try {
		 let resetDefault = await User.update(
			{
			  _id: req.session.userid,
			  //address: { $elemMatch: { is_default: true} }
			},
			{ $set: { "address.$[].is_default" : false } }
		 )
		 
		 if(!resetDefault.nModified)return res.json({ state: 0, message: "Could not updated" })

		 let setDefault = await User.update(
			{
			  _id: req.session.userid,
			  "address._id": req.params.address
			},
			{ $set: { "address.$.is_default" : true } }
		 )

		setDefault.nModified && res.redirect(req.header('Referer'));
		return res.json({ state: 1, message: "Something went wrong" })	

	} catch (err) {
		return res.status(404).json({ message: err.message })

	}
},
exports.updateaddress = async (req, res) => {
	try {
		// var address_array = [];
		// const address_value = {
		// 	address: req.body.address,
		// 	city: req.body.city,
		// 	address_type: req.body.address_type,
		// 	country: req.body.country,
		// 	region: req.body.region,
		// 	pincode: req.body.pincode,
		// 	state: req.body.state,
		// 	location: { type: "Point", coordinates: [req.body.long, req.body.lat] },
		// }
		let user = await User.findOneAndUpdate({ 'address._id': req.params.id },
			{
				$set: {
					"address.$.address": req.body.address,
					"address.$.city": req.body.city,
					"address.$.name": req.body.name,
					"address.$.mobile": req.body.mobile,
					"address.$.country": req.body.country,
					"address.$.countrycode": req.body.countrycode,
					"address.$.pincode": req.body.pincode,
					"address.$.state": req.body.state,
					"address.$.region": req.body.region,
					"address.$.location": { coordinates: [req.body.long, req.body.lat] }
				}
			},
			// { $push: { address: address_array } }, 
			{ returnOriginal: false }).exec()
		if (!user) return res.json({ status: 1, message: "Data not found" })
		return res.json({ status: 1, data: user })

	} catch (err) {
		console.log("--log", err)
		return res.status(404).json({ message: err.message })
	}

}
exports.editaddress = async (req, res) => {
	try {
		let user = await User.findOne({ 'address._id': req.params.id }).exec()
		if (!user) return res.json({ status: 1, message: "Data not found" })
		res.redirect(req.header('Referer'));


	} catch (err) {
		console.log("--log", err)
		return res.status(404).json({ message: err.message })
	}

}