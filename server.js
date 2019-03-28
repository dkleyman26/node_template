const mongoose = require('mongoose')
const app = require('./app')

// configure ports (5000 default)
PORT = process.env.PORT || 5000

// db config
const db = require('./config/keys').MongoURI

// connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
	.then(() => {
		console.log('Connected to mongo')
	})
	.catch(err => console.log(err))

// start server
app.listen(PORT, console.log(`Server started on port: ${PORT}`))	



