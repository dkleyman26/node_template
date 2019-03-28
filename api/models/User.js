const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectID = Schema.Types.ObjectId

const UserSchema = new Schema({
	_id: {
		type: ObjectID,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		match: new RegExp("[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('User', UserSchema)