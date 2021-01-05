const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const FKHelper = require('../helper/foreign-key-constraint');
const Schema = mongoose.Schema;
const StoreProductPricing = require("./store_product_pricing");
const ProductRegularPricing = require("./product_regular_pricing");
const Order = require("./order");
const Cart = require("./cart");
const Banner = require("./banner");




const storeSchema = new Schema({
    name: { type: String, required: true },
    _department: [{
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
        validate: {
            validator: function (v) {
                return FKHelper(mongoose.model('Department'), v);
            },
            message: `Department doesn't exist`
        }

    }],
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: function (v) {
                return FKHelper(mongoose.model('User'), v);
            },
            message: `User doesn't exist`
        }
    },
    _timezone: {
        type: String
    },
    // _timezone: {
    //     type: Schema.Types.ObjectId,
    //     ref:'Timezone',
    //     validate: {
    //             validator: function(v) {
    //             return FKHelper(mongoose.model('Timezone'), v);
    //          },
    //         message: `Timezone doesn't exist`
    //     }
    // },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    _country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        validate: {
            validator: function (v) {
                return FKHelper(mongoose.model('Country'), v);
            },
            message: `Country doesn't exist`
        }
    },
    lastupdatedby: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: function (v) {
                return FKHelper(mongoose.model('User'), v);
            },
            message: `User doesn't exist`
        }
    },
    zipcode: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    contact_no: {
        type: String,
        required: true
    },
    time_schedule: {
        Monday: { startTime: String, endTime: String },
        Tuesday: { startTime: String, endTime: String },
        Wednesday: { startTime: String, endTime: String },
        Thursday: { startTime: String, endTime: String },
        Friday: { startTime: String, endTime: String },
        Saturday: { startTime: String, endTime: String },
        Sunday: { startTime: String, endTime: String }
    },
    holidays: [
        {
            startDate: Date,
            endDate: Date,
            message: String
        }
    ]
}, { timestamps: true });

storeSchema.pre("deleteOne", async function (next) {
    const _store = this.getQuery()["_id"];
    await Promise.all(
        StoreProductPricing.deleteMany({ _store: _store }).exec(),
        ProductRegularPricing.deleteMany({ _store: _store }).exec(),
        Order.deleteMany({ _store: _store }).exec(),
        Cart.deleteMany({ _store: _store }).exec(),
        Banner.deleteMany({ _store: _store }).exec()
    )
    next()
});


storeSchema.index({ location: "2dsphere" })
storeSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Store', storeSchema);