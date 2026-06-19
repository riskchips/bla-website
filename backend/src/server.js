require("dotenv").config()

const express = require("express")
const helmet = require("helmet")
const compression = require("compression")
const cors = require("cors")
const path = require("path")
const fs = require("fs").promises

const notificationRoutes = require("./routes/notificationRoutes")
const contactRoutes = require("./routes/contactRoutes")
const helpRoutes = require("./routes/helpRoutes")
const boardRoutes = require("./routes/boardRoutes")
const eventRoutes = require("./routes/eventRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

app.set("trust proxy", 1)

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],

                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://challenges.cloudflare.com"
                ],

                frameSrc: [
                    "'self'",
                    "https://challenges.cloudflare.com"
                ],

                connectSrc: [
                    "'self'",
                    "https://challenges.cloudflare.com"
                ],

                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com"
                ],

                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com",
                    "data:"
                ],

                imgSrc: [
                    "'self'",
                    "data:",
                    "https://s6.imgcdn.dev/"
                ]
            }
        }
    })
)

app.use(compression())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json({
    limit: "20kb"
}))

const frontendPath = path.join(
    __dirname,
    "../../frontend/dist"
)

const assetsPath = path.join(
    __dirname,
    "../assets"
)

app.use(
    "/assets",
    express.static(
        assetsPath,
        {
            index: false,
            extensions: false
        }
    )
)

app.use("/api", notificationRoutes)
app.use("/api", contactRoutes)
app.use("/api", helpRoutes)
app.use("/api", boardRoutes)
app.use("/api", eventRoutes)
app.use("/api", adminRoutes)

app.get("/api/terms", async (req, res) => {
    try {
        const file = await fs.readFile(
            path.join(
                __dirname,
                "../terms.txt"
            ),
            "utf8"
        )

        res.json({
            success: true,
            terms: file
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: "Failed to load terms"
        })
    }
})

app.get("/api/privacy", async (req, res) => {
    try {
        const file = await fs.readFile(
            path.join(
                __dirname,
                "../privacy.txt"
            ),
            "utf8"
        )

        res.json({
            success: true,
            privacy: file
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: "Failed to load privacy policy"
        })
    }
})

app.use(express.static(frontendPath))

app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({
            success: false,
            message: "Route not found"
        })
    }

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    )
})

app.listen(
    process.env.PORT || 3000,
    () => {
        console.log(
            `Server running on port ${
                process.env.PORT || 3000
            }`
        )
    }
)