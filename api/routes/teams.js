const express = require('express')
const teams = express.Router()
const Arena = require('../models/Arena')
const Team = require('../models/Team')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')

// POST
teams.post('/:arenaID', checkAuth, (req, res, next) => {
	const id = req.params.arenaID
	const newTeam = new Team({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		headCoachName: req.body.headCoachName,
		arena: id
	})
	newTeam.save()
		.then(team => {
			console.log('Team Saved')
			Arena.findByIdAndUpdate(id, {team: newTeam}).populate('team').exec()
				.then(arena => {
					console.log('Arena updated')
					res.status(200).send({
						success: true, 
						updatedArena: arena
					})
				})
				.catch(err => {
					res.status(200).send({
						success: false, 
						error: err
					})
				})
		})
		.catch(err => {
			res.status(500).send({
				error: err
			})
		})
})

// GET
teams.get('/', checkAuth, (req, res, next) => {
	Team.find().select('name headCoachName').populate('arena', 'name location').exec()
		.then(teams => {
			res.status(200).send(teams)
		})
		.catch(err => {
			res.send(err)
		})
})

teams.get('/:teamID', checkAuth, (req, res, next) => {
	const id = req.params.teamID
	Team.findById(id).select('name headCoachName').populate('arena', 'name location').exec()
		.then(team => {
			if (team) {
				res.send(team)
			} else {
				res.status(404).send({
					error: "No ID Found"
				})
			}
		})
		.catch(err => {
			res.send({error: err})
		})
})

// DELETE
teams.delete('/:teamID', checkAuth, (req, res, next) => {
	const id = req.params.teamID
	Team.findByIdAndDelete(id).exec()
		.then(doc => {
			if (doc) {
				const response = {
					success: true,
					deletedDoc: doc
				}
				res.status(200).send(response)
			} else {
				res.status(404).send({
					error: "No ID Found"
				})
			}
		})
		.catch(err => {
			res.status(500).send({
				error: err
			})
		})
})

module.exports = teams