const express = require("express")

const {
    eventLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

const adminAuth = require("../middleware/adminAuth")
const supabase = require("../config/supabase")

const router = express.Router()

// --- Event Categories CRUD ---

router.post(
    "/create/category",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { name, sort_order } = req.body
            if (!name) return res.status(400).json({ success: false, message: "Name required" })
            const { data, error } = await supabase
                .from("event_categories")
                .insert({ name: name.trim(), sort_order: sort_order || 0 })
                .select().single()
            if (error) return res.status(500).json({ success: false, message: "Database Error" })
            return res.json({ success: true, category: data })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, message: "Server Error" })
        }
    }
)

router.get(
    "/get/categories",
    eventLimiter,
    async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("event_categories")
                .select("*")
                .order("sort_order", { ascending: true })
            if (error) return res.status(500).json({ success: false, message: "Database Error" })
            return res.json({ success: true, categories: data })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, message: "Server Error" })
        }
    }
)

router.put(
    "/update/categories/order",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { orders } = req.body; // Array of { id, sort_order }
            if (!Array.isArray(orders)) return res.status(400).json({ success: false, message: "Invalid format" });
            
            // Supabase doesn't have a direct bulk update in its simple API without upsert, so we loop:
            for (const item of orders) {
                await supabase.from("event_categories").update({ sort_order: item.sort_order }).eq("id", item.id);
            }
            
            return res.json({ success: true, message: "Order updated" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server Error" });
        }
    }
)

router.put(
    "/update/category/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params
            const { name, sort_order } = req.body
            if (!name) return res.status(400).json({ success: false, message: "Name required" })
            const { data, error } = await supabase
                .from("event_categories")
                .update({ name: name.trim(), sort_order: sort_order || 0 })
                .eq("id", id)
                .select().single()
            if (error) return res.status(500).json({ success: false, message: "Database Error" })
            return res.json({ success: true, category: data })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, message: "Server Error" })
        }
    }
)

router.delete(
    "/delete/category/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params
            const { error } = await supabase.from("event_categories").delete().eq("id", id)
            if (error) return res.status(500).json({ success: false, message: "Database Error" })
            return res.json({ success: true, message: "Deleted" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, message: "Server Error" })
        }
    }
)

// --- Events CRUD ---

router.post(
    "/create/event",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { name, description, timestamp, gallery, poster_image, category_id } = req.body

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
                    gallery: Array.isArray(gallery) ? gallery : [],
                    poster_image: poster_image ? poster_image.trim() : null,
                    category_id: category_id || null
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
            // Fetch events with categories
            const { data, error } = await supabase
                .from("events")
                .select("*, event_categories(name)")
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
            const { name, description, timestamp, gallery, poster_image, category_id } = req.body

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
                    gallery: Array.isArray(gallery) ? gallery : [],
                    poster_image: poster_image ? poster_image.trim() : null,
                    category_id: category_id || null
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