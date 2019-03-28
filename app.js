const express = require('express')
const app = express()
const morgan = require('morgan')
const parser = require('body-parser')

const userRoute = require('./api/routes/user')
const arenasRoute = require('./api/routes/arenas')
const teamsRouter = require('./api/routes/teams')


// add morgan and body parser and uploads static folder
app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())


// CORS error handling
app.use((req, res, next) => {
	res.header('Access-Control-Allow_Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

	if (req.method == 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, PATCH')
		return res.status(200).json({})
	}
	next()
})

// create routes
app.use('/arenas', arenasRoute)
app.use('/user', userRoute)
app.use('/teams', teamsRouter)

// error handling
app.use((req, res, next) => {
	const error = new Error('Page not found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		message: error.message
	})
})

module.exports = app