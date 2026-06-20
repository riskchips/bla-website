const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const adminAuth = require("../middleware/adminAuth");
const { aboutLimiter, adminLimiter } = require("../middleware/rateLimits");

router.get("/about", aboutLimiter, async (req, res) => {
    try {
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
