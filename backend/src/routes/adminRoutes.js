const express = require("express")

const router = express.Router()

const adminAuth = require("../middleware/adminAuth")
const { adminLimiter } = require("../middleware/rateLimits")

router.post(
    "/admin/verify",
    adminLimiter,
    adminAuth,
    (req, res) => {
        // If it passes adminAuth, the token is valid.
        res.json({
            success: true,
            message: "Authorized"
        })
    }
)

module.exports = router
