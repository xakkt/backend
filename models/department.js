const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const departmentSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    no_of_stores: {
        type: Number,
        default:0,
    },
   description: {
        type: String,
        required: true
    },
    logo: {
        type: String,
    },
     is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

departmentSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Departments', departmentSchema);