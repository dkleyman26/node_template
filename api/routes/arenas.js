const express = require('express')
const arenas = express.Router()
const mongoose = require('mongoose')
const Arena = require('../models/Arena')

// upload images
const multer = require('multer')
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname)
	}
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

const upload = multer({
	storage: storage, 
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
})

// PATCH
arenas.patch('/:arenaID', (req, res, next) => {
	const id = req.params.arenaID

	Arena.findByIdAndUpdate(id, req.body).exec()
	.then((doc) => {
		if (doc) {
			const response = {
				success: true,
				patchedArena: {
					name: doc.name,
					location: doc.location,
				},
				request: {
					type: 'GET',
					url: 'http://localhost:5000/arenas/' + id
				}
			}
			res.status(200).send(response)
		} else {
			res.status(404).send({error: "NO DOC WITH ID"})
		}
	})
	.catch((err) => {
		res.send({error: err})
	})
})

// POST
arenas.post('/', upload.single('arenaImage'),(req, res, next) => {
	const filePath = ""
	console.log(req.file)
	if (req.file) {
		const filePath = req.file.path
	}
	const newArena = new Arena({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		location: req.body.location,
		arenaImage: filePath
	})
	newArena.save()
		.then(() => {
			const response = {
				success: true,
				addedArena: {
					name: newArena.name,
					_id: newArena._id,
					location: newArena.location
				},
				request: {
					type: "GET",
					url: "http://localhost:5000/arenas" + newArena._id
				}
			}
			res.status(201).send(response)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json(err)
		})
})

// GET
arenas.get('/:arenaID', (req, res, next) => {
	console.log("GETTING arena by id")
	Arena.findById(req.params.arenaID).exec()
		.then((arena) => {
			if (arena) {
				res.status(200).json(arena)
			} else {
				res.status(404).json({error:"No arenas found"})
			}
		})
		.catch((err) => {
			console.log(err)
			res.status(500).json({error: err})
		})
})

arenas.get('/', (req, res, next) => {
	console.log('getting all arenas')
	Arena.find().select('name location _id arenaImage').populate('team', 'name headCoachName').exec()
		.then((arenas) => {
			// res.status(200).json(arenas)
			res.send({success: true, arenas: arenas})
		})
		.catch((err) => {
			res.status(500).json({error: err})
		})
})

// DELETE
arenas.delete('/:arenaID', (req, res, next) => {
	console.log('deleting arena by id')
	Arena.findByIdAndDelete(req.params.arenaID).exec()
		.then((result) => {
			if (result) {
				res.status(200).json({
					success: true,
					response: result
				})
			} else {
				res.status(200).json({
					success: false,
					response: "ID Not found"
				})
			}
		})
		.catch((err) => {
			res.status(500).json({error: err})
		})
})

module.exports = arenas