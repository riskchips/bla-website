const express = require("express")
const fs = require("fs").promises
const path = require("path")

const {
    teamLimiter
} = require("../middleware/rateLimits")

const router = express.Router()

router.get(
    "/team",
    teamLimiter,
    async (req, res) => {
        try {
            const filePath = path.join(
                process.cwd(),
                "team.json"
            )

            const file =
                await fs.readFile(
                    filePath,
                    "utf8"
                )

            const data = JSON.parse(file)

            return res.json({
                success: true,
                team: data
            })
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                success: false,
                message: "Failed to load team data"
            })
        }
    }
)

module.exports = router