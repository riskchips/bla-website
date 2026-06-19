const express = require("express")

const router = express.Router()

const supabase = require("../config/supabase")

const adminAuth = require("../middleware/adminAuth")
const browserGuard = require("../middleware/browserGuard")

const {
    notificationLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

router.get(
    "/notifications",
    browserGuard,
    notificationLimiter,
    async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .order("unix_timestamp", {
                    ascending: false
                })

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                })
            }

            return res.json({
                success: true,
                notifications: data
            })
        } catch {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

router.post(
    "/create/notification",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const {
                title,
                details,
                date,
                buttons
            } = req.body

            if (
                !title ||
                !details ||
                !date
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Missing fields"
                })
            }

            if (
                buttons &&
                !Array.isArray(buttons)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Buttons must be array"
                })
            }

            const parsedButtons = []

            if (buttons) {
                for (const button of buttons) {
                    if (
                        !button.name ||
                        !button.link
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: "Invalid button"
                        })
                    }

                    try {
                        new URL(button.link)
                    } catch {
                        return res.status(400).json({
                            success: false,
                            message: "Invalid button link"
                        })
                    }

                    parsedButtons.push({
                        name: button.name.trim(),
                        link: button.link.trim()
                    })
                }
            }

            const unixTimestamp = Date.now()

            const { data, error } = await supabase
                .from("notifications")
                .insert({
                    title: title.trim(),
                    details: details.trim(),
                    date: date.trim(),
                    buttons: parsedButtons,
                    unix_timestamp: unixTimestamp
                })
                .select()
                .single()

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                })
            }

            return res.json({
                success: true,
                notification: data
            })
        } catch {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

router.delete(
    "/delete/notification/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("id", id)

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                })
            }

            return res.json({
                success: true,
                message: "Notification deleted"
            })
        } catch {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

module.exports = router