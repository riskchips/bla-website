const express = require("express")

const {
    eventLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

const adminAuth = require("../middleware/adminAuth")
const supabase = require("../config/supabase")

const router = express.Router()

router.post(
    "/create/event",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { name, description, timestamp, gallery } = req.body

            if (!name || !description || !timestamp) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                })
            }

            const { data, error } = await supabase
                .from("events")
                .insert({
                    name: name.trim(),
                    description: description.trim(),
                    timestamp: timestamp.toString(),
                    gallery: Array.isArray(gallery) ? gallery : []
                })
                .select()
                .single()

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.json({
                success: true,
                event: data
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

router.get(
    "/get/events",
    eventLimiter,
    async (req, res) => {
        try {
            // Sort by timestamp descending so newest events appear first
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .order("timestamp", { ascending: false })

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.json({
                success: true,
                events: data
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

router.delete(
    "/delete/event/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            const { error } = await supabase
                .from("events")
                .delete()
                .eq("id", id)

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.json({
                success: true,
                message: "Event deleted"
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

router.put(
    "/update/event/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params
            const { name, description, timestamp, gallery } = req.body

            if (!name || !description || !timestamp) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                })
            }

            const { data, error } = await supabase
                .from("events")
                .update({
                    name: name.trim(),
                    description: description.trim(),
                    timestamp: timestamp.toString(),
                    gallery: Array.isArray(gallery) ? gallery : []
                })
                .eq("id", id)
                .select()
                .single()

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.json({
                success: true,
                event: data
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

module.exports = router