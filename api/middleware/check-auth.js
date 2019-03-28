const jwt = require('jsonwebtoken')
const jwt_private_key = require('../../config/keys').JWT_PRIVATE_KEY

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decoded = jwt.verify(token, jwt_private_key)
		req.usableData = decoded
		next()
	} catch {
		return res.status(401).send({
			success: false,
			message: "Auth Failed"
		});
	}
}