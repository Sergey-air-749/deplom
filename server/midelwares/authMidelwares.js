const jwt = require('jsonwebtoken')

const authMidelwares = (req, res, next) => {
    const token = req.headers["authorization"]

    if (!token) {
        res.status(401).json({msg: "No token"})
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY)
        console.log(decoded);
        req.userId = decoded.id
        req.decoded = decoded
        next()
    } catch (error) {
        res.status(401).json({msg: "invalid token"}) 
    }
}

module.exports = authMidelwares;