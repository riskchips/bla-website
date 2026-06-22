const express = require("express");
const router = express.Router();

// SUPABASE COMMENTED OUT:
// const supabase = require("../config/supabase");
// TIDB IMPORT:
const pool = require("../config/tidb");

const adminAuth = require("../middleware/adminAuth");
const { aboutLimiter, adminLimiter } = require("../middleware/rateLimits");

router.get("/about", aboutLimiter, async (req, res) => {
    try {
        /* SUPABASE LOGIC
        const { data, error } = await supabase
            .from("about_content")
            .select("content")
            .eq("id", 1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is not found
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        return res.json({
            success: true,
            content: data ? data.content : ""
        });
        */

        // TIDB LOGIC
        const [rows] = await pool.query(
            "SELECT content FROM about_content WHERE id = 1 LIMIT 1"
        );

        return res.json({
            success: true,
            content: rows.length > 0 ? rows[0].content : ""
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.put("/update/about", adminLimiter, adminAuth, async (req, res) => {
    try {
        const { content } = req.body;
        if (typeof content !== 'string') {
            return res.status(400).json({ success: false, message: "Content required" });
        }

        /* SUPABASE LOGIC
        const { data, error } = await supabase
            .from("about_content")
            .upsert({ id: 1, content: content.trim(), updated_at: new Date() })
            .select()
            .single();

        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

        return res.json({ success: true, content: data.content });
        */

        // TIDB LOGIC
        const trimmedContent = content.trim();
        await pool.execute(
            `INSERT INTO about_content (id, content, updated_at) 
             VALUES (1, ?, NOW()) 
             ON DUPLICATE KEY UPDATE content = VALUES(content), updated_at = NOW()`,
            [trimmedContent]
        );

        // Fetch back to confirm (similar to .select().single())
        const [rows] = await pool.query("SELECT content FROM about_content WHERE id = 1");

        return res.json({ success: true, content: rows[0].content });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
