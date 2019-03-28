const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectID = Schema.Types.ObjectId

const TeamSchema = new Schema({
	_id: {
		type: ObjectID,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	headCoachName: {
		type: String,
		required: true
	},
	arena: {
		type: ObjectID,
		ref: 'Arena',
		required: false
	}
})

module.exports = mongoose.model('Team', TeamSchema)