const express = require("express")

const {
    eventLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

const adminAuth = require("../middleware/adminAuth")
// SUPABASE LOGIC COMMENTED OUT
// const supabase = require("../config/supabase")
const pool = require("../config/tidb")

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
            
            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("event_categories")
                .insert({ name: name.trim(), sort_order: sort_order || 0 })
                .select().single()
            */
            
            // TIDB LOGIC
            const cleanName = name.trim();
            const order = sort_order || 0;
            const [result] = await pool.execute(
                "INSERT INTO event_categories (name, sort_order) VALUES (?, ?)",
                [cleanName, order]
            );
            const [rows] = await pool.query("SELECT * FROM event_categories WHERE id = ?", [result.insertId]);

            return res.json({ success: true, category: rows[0] })
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
            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("event_categories")
                .select("*")
                .order("sort_order", { ascending: true })
            */

            // TIDB LOGIC
            const [rows] = await pool.query("SELECT * FROM event_categories ORDER BY sort_order ASC");

            return res.json({ success: true, categories: rows })
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
            const { orders } = req.body; 
            if (!Array.isArray(orders)) return res.status(400).json({ success: false, message: "Invalid format" });
            
            /* SUPABASE LOGIC
            for (const item of orders) {
                await supabase.from("event_categories").update({ sort_order: item.sort_order }).eq("id", item.id);
            }
            */
            
            // TIDB LOGIC
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                for (const item of orders) {
                    await connection.execute("UPDATE event_categories SET sort_order = ? WHERE id = ?", [item.sort_order, item.id]);
                }
                await connection.commit();
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
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
            
            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("event_categories")
                .update({ name: name.trim(), sort_order: sort_order || 0 })
                .eq("id", id)
                .select().single()
            */
            
            // TIDB LOGIC
            const cleanName = name.trim();
            const order = sort_order || 0;
            await pool.execute(
                "UPDATE event_categories SET name = ?, sort_order = ? WHERE id = ?",
                [cleanName, order, id]
            );
            const [rows] = await pool.query("SELECT * FROM event_categories WHERE id = ?", [id]);

            return res.json({ success: true, category: rows[0] })
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
            
            /* SUPABASE LOGIC
            const { error } = await supabase.from("event_categories").delete().eq("id", id)
            */

            // TIDB LOGIC
            await pool.execute("DELETE FROM event_categories WHERE id = ?", [id]);

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

            /* SUPABASE LOGIC
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
            */
            
            // TIDB LOGIC
            const cleanName = name.trim();
            const cleanDesc = description.trim();
            const tsString = timestamp.toString();
            
            let parsedGallery = [];
            if (Array.isArray(gallery)) {
                parsedGallery = gallery;
            } else if (typeof gallery === 'string') {
                try {
                    const parsed = JSON.parse(gallery);
                    if (Array.isArray(parsed)) parsedGallery = parsed;
                } catch (e) { /* ignore */ }
            }
            const galleryJson = JSON.stringify(parsedGallery);
            const poster = poster_image ? poster_image.trim() : null;
            const catId = category_id || null;

            const [result] = await pool.execute(
                `INSERT INTO events (name, description, timestamp, gallery, poster_image, category_id)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [cleanName, cleanDesc, tsString, galleryJson, poster, catId]
            );

            const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [result.insertId]);

            return res.json({
                success: true,
                event: rows[0]
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
            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("events")
                .select("*, event_categories(name)")
                .order("timestamp", { ascending: false })
            */

            // TIDB LOGIC
            const [rows] = await pool.query(`
                SELECT e.*, c.name AS category_name 
                FROM events e 
                LEFT JOIN event_categories c ON e.category_id = c.id 
                ORDER BY e.timestamp DESC
            `);
            
            // Map the joined data to match Supabase's nested structure
            const data = rows.map(row => {
                const { category_name, ...eventData } = row;
                if (typeof eventData.gallery === 'string') {
                    try { eventData.gallery = JSON.parse(eventData.gallery); } catch(e) {}
                }
                return {
                    ...eventData,
                    event_categories: category_name ? { name: category_name } : null
                };
            });

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

            /* SUPABASE LOGIC
            const { error } = await supabase
                .from("events")
                .delete()
                .eq("id", id)
            */

            // TIDB LOGIC
            await pool.execute("DELETE FROM events WHERE id = ?", [id]);

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

            /* SUPABASE LOGIC
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
            */
            
            // TIDB LOGIC
            const cleanName = name.trim();
            const cleanDesc = description.trim();
            const tsString = timestamp.toString();
            const galleryJson = Array.isArray(gallery) ? JSON.stringify(gallery) : JSON.stringify([]);
            const poster = poster_image ? poster_image.trim() : null;
            const catId = category_id || null;

            await pool.execute(
                `UPDATE events 
                 SET name = ?, description = ?, timestamp = ?, gallery = ?, poster_image = ?, category_id = ?
                 WHERE id = ?`,
                [cleanName, cleanDesc, tsString, galleryJson, poster, catId, id]
            );

            const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);

            return res.json({
                success: true,
                event: rows[0]
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