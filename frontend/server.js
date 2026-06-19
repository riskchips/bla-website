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
const teamRoutes = require("./routes/teamRoutes")
const eventRoutes = require("./routes/eventRoutes")

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
                    "https:"
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

// Serve the built React SPA from /frontend/dist
const frontendPath = path.join(
    __dirname,
    "../../frontend/dist"
)

const assetsPath = path.join(
    __dirname,
    "../assets"
)

app.use(express.static(frontendPath))

// Assets folder — image-only guard (unchanged behaviour)
app.use("/assets", (req, res, next) => {
    const allowedExtensions = [
        ".png", ".jpg", ".jpeg",
        ".gif", ".webp", ".svg", ".ico"
    ]
    const extension = path.extname(req.path).toLowerCase()
    if (!allowedExtensions.includes(extension)) {
        return res.status(403).json({
            success: false,
            message: "Only images allowed"
        })
    }
    next()
})

app.use(
    "/assets",
    express.static(assetsPath, {
        index: false,
        extensions: false
    })
)

// API routes
app.use("/api", notificationRoutes)
app.use("/api", contactRoutes)
app.use("/api", helpRoutes)
app.use("/api", teamRoutes)
app.use("/api", eventRoutes)

// Public terms & privacy text endpoints
app.get("/api/terms", async (req, res) => {
    try {
        const file = await fs.readFile(
            path.join(__dirname, "../terms.txt"),
            "utf8"
        )
        res.json({ success: true, terms: file })
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
            path.join(__dirname, "../privacy.txt"),
            "utf8"
        )
        res.json({ success: true, privacy: file })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to load privacy policy"
        })
    }
})

// SPA fallback — any non-API request returns index.html so React Router
// can handle the client-side route (including the hidden admin paths).
app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({
            success: false,
            message: "Route not found"
        })
    }
    res.sendFile(path.join(frontendPath, "index.html"))
})

app.listen(
    process.env.PORT || 3000,
    () => {
        console.log(
            `Server running on port ${process.env.PORT || 3000}`
        )
    }
)
