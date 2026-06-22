const express = require("express")
const router = express.Router()

// SUPABASE LOGIC COMMENTED OUT
// const supabase = require("../config/supabase")
const pool = require("../config/tidb")

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
            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .order("unix_timestamp", {
                    ascending: false
                })
            */

            // TIDB LOGIC
            const [rows] = await pool.query("SELECT * FROM notifications ORDER BY unix_timestamp DESC");

            // Map json fields
            const data = rows.map(row => {
                if (typeof row.buttons === 'string') {
                    try { row.buttons = JSON.parse(row.buttons); } catch(e) {}
                }
                return row;
            });

            return res.json({
                success: true,
                notifications: data
            })
        } catch (err) {
            console.error(err);
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

            if (!title || !details || !date) {
                return res.status(400).json({ success: false, message: "Missing fields" })
            }

            if (buttons && !Array.isArray(buttons)) {
                return res.status(400).json({ success: false, message: "Buttons must be array" })
            }

            const parsedButtons = []

            if (buttons) {
                for (const button of buttons) {
                    if (!button.name || !button.link) {
                        return res.status(400).json({ success: false, message: "Invalid button" })
                    }

                    try {
                        new URL(button.link)
                    } catch {
                        return res.status(400).json({ success: false, message: "Invalid button link" })
                    }

                    parsedButtons.push({
                        name: button.name.trim(),
                        link: button.link.trim()
                    })
                }
            }

            const unixTimestamp = Date.now()

            /* SUPABASE LOGIC
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
            */
            
            // TIDB LOGIC
            const cleanTitle = title.trim();
            const cleanDetails = details.trim();
            const cleanDate = date.trim();
            const buttonsJson = JSON.stringify(parsedButtons);

            const [result] = await pool.execute(
                `INSERT INTO notifications (title, details, date, buttons, unix_timestamp)
                 VALUES (?, ?, ?, ?, ?)`,
                [cleanTitle, cleanDetails, cleanDate, buttonsJson, unixTimestamp]
            );

            const [rows] = await pool.query("SELECT * FROM notifications WHERE id = ?", [result.insertId]);

            return res.json({
                success: true,
                notification: rows[0]
            })
        } catch (err) {
            console.error(err);
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

            /* SUPABASE LOGIC
            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("id", id)
            */

            // TIDB LOGIC
            await pool.execute("DELETE FROM notifications WHERE id = ?", [id]);

            return res.json({
                success: true,
                message: "Notification deleted"
            })
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
)

module.exports = router