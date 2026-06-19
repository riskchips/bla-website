const rateLimit = require("express-rate-limit")

const notificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true
})

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false
})

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true
})

const helpLimiter = rateLimit({
windowMs: 60 * 60 * 1000,
max: 3,
standardHeaders: true,
legacyHeaders: false
})

const boardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Too many board requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
})    

const eventLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {
notificationLimiter,
contactLimiter,
helpLimiter,
adminLimiter,
boardLimiter,
eventLimiter
}
