const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectID = Schema.Types.ObjectId

const ArenaSchema = new Schema({
	_id: {
		type: ObjectID,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	team: {
		type: ObjectID,
		ref: 'Team',
		default: null
	},
	arenaImage: {
		type: String,
		required: false
	}
})

const Arena = mongoose.model('Arena', ArenaSchema)
module.exports = Arena

