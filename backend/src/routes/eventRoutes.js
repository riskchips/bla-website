const express = require("express")
const fs = require("fs").promises
const path = require("path")

const {
    eventLimiter
} = require("../middleware/rateLimits")

const router = express.Router()

router.get(
    "/get/events",
    eventLimiter,
    async (req, res) => {
        try {
            const filePath = path.join(
                process.cwd(),
                "events.json"
            )

            const file =
                await fs.readFile(
                    filePath,
                    "utf8"
                )

            const events =
                JSON.parse(file)

            return res.json({
                success: true,
                ...events
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                success: false,
                message: "Failed to load events"
            })
        }
    }
)

module.exports = router