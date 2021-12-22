const User = require('../../models/user');
var randomstring = require("randomstring");
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var moment = require('moment');
const {
	validationResult
} = require('express-validator');
const Device = require('../../models/device')
var md5 = require('md5');
const transporter = require('../../config/transporter-mail');
var fs = require('fs');

const app = express();
var server = require('http').Server(app);
const ejs = require("ejs");
const path = require('path')


exports.addAddress = async (req, res) => {

	try {

		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
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

		let user = await User.findOneAndUpdate({
			_id: req.session.userid
		}, {
			$push: {
				address: address_array
			}
		}, {
			returnOriginal: false
		}).exec()
		if (user.address.length == 1) {
			await User.update({
				_id: req.session.userid,
				"address._id": user.address[0]._id
			}, {
				$set: {
					"address.$.is_default": true
				}
			})
		}
		if (!user) return res.json({
			status: 1,
			message: "Data not found"
		})
		res.redirect(req.header('Referer'));

	} catch (err) {
		console.log("--log", err)
		return res.status(404).json({
			message: err.message
		})
	}
}
exports.addresslist = async (req, res) => {

	try {

		if (req.query.default) {

			var defaultAddress = await User.findOne({
				_id: req.decoded.id
			}, {
				address: {
					$elemMatch: {
						is_default: req.query.default
					}
				}
			}).lean()
			if (!defaultAddress.address) {
				return res.json({
					status: 0,
					message: "No default address added for you"
				})
			}
			return res.json({
				data: defaultAddress
			})
		}

		let user = await User.findOne({
			_id: req.decoded.id
		}, "contact_no email first_name last_name address").select('-_id').lean()
		// let user = await User.findOne({ _id: req.decoded.id }).select('-_id -password -role_id -coupons -last_login -updatedAt -createdAt -ncrStatus').lean()

		if (!user) return res.json({
			status: 0,
			message: "Data not found"
		})
		return res.json({
			state: 1,
			data: user
		})


	} catch (err) {
		console.log("--err", err)
		return res.status(404).json({
			message: err.message
		})

	}

}
exports.deleteAddress = async (req, res) => {

	try {
		let user = await User.findOneAndUpdate({
			_id: req.session.userid
		}, {
			$pull: {
				address: {
					_id: req.params.address
				}
			}
		}, {
			new: true
		}).lean()
		if (!user) return res.json({
			status: 0,
			message: "Data not found"
		})
		res.redirect(req.header('Referer'));


	} catch (err) {
		return res.status(404).json({
			message: err.message
		})

	}
}
exports.makeDefaultAddress = async (req, res) => {
		try {
			let resetDefault = await User.update({
				_id: req.session.userid,
				//address: { $elemMatch: { is_default: true} }
			}, {
				$set: {
					"address.$[].is_default": false
				}
			})

			if (!resetDefault.nModified) return res.json({
				state: 0,
				message: "Could not updated"
			})

			let setDefault = await User.update({
				_id: req.session.userid,
				"address._id": req.params.address
			}, {
				$set: {
					"address.$.is_default": true
				}
			})

			setDefault.nModified && res.redirect(req.header('Referer'));
			return res.json({
				state: 1,
				message: "Something went wrong"
			})

		} catch (err) {
			return res.status(404).json({
				message: err.message
			})

		}
	},
	exports.updateAddress = async (req, res) => {
		try {

			let user = await User.findOneAndUpdate({
					'address._id': req.params.id
				}, {
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
						"address.$.location": {
							coordinates: [req.body.long, req.body.lat]
						}
					}
				},
				// { $push: { address: address_array } }, 
				{
					returnOriginal: false
				}).exec()
			if (!user) return res.json({
				status: 1,
				message: "Data not found"
			})
			return res.json({
				status: 1,
				data: user
			})

		} catch (err) {
			console.log("--log", err)
			return res.status(404).json({
				message: err.message
			})
		}

	}
exports.editaddress = async (req, res) => {
	try {

		let user = await User.findOne({
			'address._id': req.params.id
		}, 'address').exec()
		let address = await user.address.id(req.params.id);

		if (!address) return res.json({
			status: 0,
			message: "Data not found"
		})
		return res.json({
			status: 1,
			data: address
		})

	} catch (err) {
		console.log("--log", err)
		return res.status(404).json({
			message: err.message
		})
	}

}
exports.editProfile = async (req, res) => {
	try {
		let user = await User.findOne({
			_id: req.session.userid
		}).exec()
		return res.render('frontend/edit-profile', {
			user: user
		})
	} catch (err) {
		console.log(err)
		return res.json({
			data: err
		})
	}

}

exports.updateProfile = async (req, res) => {
		try {
			let user = await User.findOne({
				_id: req.params.id
			})
			if (req.body.old_password) {
				if (!req.body.old_password == user.password) {
					return res.json({
						data: "old password is incorrect"
					})
				}

			}
			const pass = await md5(req.body.password)
			const userUpdate = await User.findOneAndUpdate({
				_id: req.params.id
			}, {
				$set: {
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email: req.body.email,
					password: pass ? pass : user.password,
					contact_no: req.body.contact_no,
					dob: req.body.dob
				}
			})
			if (userUpdate) {
				return res.send("done")
			}
		} catch (err) {
			console.log(err)
			return res.json({
				data: err
			})
		}

	},

exports.forgotPasswordPage = async (req, res) => {
		try {
			return res.render('frontend/modals/forgot-password')
		} catch (err) {
			res.status(400).json({
				'data': err
			})
		}
	}
exports.forgotPassword = async (req, res) => {
	try {
		console.log("=======heree", req.body.email)

		// const password = randomstring.generate({ length: 12, charset: 'alphanumeric' });
		// const info = { email: req.body.email, password: password }
		// mail = new Mail(info);
		// //const encrypted_password = await bcrypt.hashSync(password, saltRounds);
		// const encrypted_password = await md5(password);
		const user = await User.findOne({
			email: req.body.email
		});
		if (!user) {
			res.status(400).json({
				status: 0,
				message: "Email not found"
			});
		}
		if (user) {
			const data = await ejs.renderFile(path.join( "views/frontend/reset-password-Email-template.ejs"),{
				name: 'Stranger'
			});
			const mainOptions = {
				from:`Message from @xakkt.com <donotreply@xakkt.com>`,
				to: req.body.email,
				subject:"xakkt",
				html: data
			};
			transporter.sendMail(mainOptions, (err, info) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Message sent: ' + info.response);
				}
			});

		}
	} catch (err) {
		res.status(400).json({
			'data': err
		})
	}
}

exports.emailToResetPasswordPage = async (req, res) => {
	try {
		console.log("====")
		return res.render('frontend/reset-password')
	} catch (err) {
		res.status(400).json({
			'data': err
		})
	}
}