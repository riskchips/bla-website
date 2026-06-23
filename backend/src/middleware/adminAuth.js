module.exports = (req, res, next) => {
    let token = req.headers.authorization
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7)
    }

    if (!token || token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }

    next()
}