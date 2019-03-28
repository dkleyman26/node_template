const express = require('express');
const user = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const jwt_private_key = require('../../config/keys').JWT_PRIVATE_KEY
const checkAuth = require('../middleware/check-auth')

user.post('/signup', (req, res, next) => {
	User.find({email: req.body.email}).exec()
	.then((email) => {
		if (email.length > 0) {
			res.status(422).send({
				message: "User exists"
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					res.status(500).send({
						error: err
					});
				} else {
					const user = new User({
						_id: mongoose.Types.ObjectId(),
						name: req.body.name,
						email: req.body.email,
						password: hash
					})
					console.log(user)
					user.save()
						.then(() => {
							res.status(201).send({
								success: true,
								message: 'User created'
							})
						})
						.catch(err => {
							res.status(500).send({
								error: err
							});
						});
				};
			});
		}
 	})
});

// login handle
user.post('/login', (req, res, next) => {
		User.findOne({email: req.body.email}).exec()
		.then(user => {
			if (!user) {
				res.status(401).send({
					success: false,
					message: "Auth Failed"
				});
			} else {
				bcrypt.compare(req.body.password, user.password, (err, same) => {
					if (err) {
						res.status(401).send({
							success: false,
							message: "Auth Failed"
						});
					}
					if (same) {
						const data = user.email
						const token = jwt.sign({
							data: data
						}, jwt_private_key, { expiresIn: '1h' });

						res.status(200).send({
							success: true,
							data: data,
							token: token
						})
					} else {
						res.status(401).send({
							success: false,
							message: "Auth Failed"
						});
					}
				})
			}
		})
		.catch(err => {
			res.status(500).send({
				error: err
			})
		})
});

user.delete('/:userID', (req, res, next) => {
	User.findByIdAndDelete(req.params.userID).exec()
		.then((user) => {
			if (user) {
				res.status(200).send({
					success: true,
					message: "User deleted"
				});
			} else {
				res.status(200).send({
					success: false,
					message: "No user to delete"
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				error: err
			});
		});
});

module.exports = user;