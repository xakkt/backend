const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const storeSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    store_no: {
        type: Number
    },
    zipcode: {
        type: Number,
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
    description: {
        type: String,
        required: true
    },
    logo: {
        type: String,

    },
    contact_no: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: String,
        default: false
    },
    icon: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

storeSchema.index({ location: "2dsphere" })
storeSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Store', storeSchema);