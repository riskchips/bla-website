const express = require("express");
const router = express.Router();
const pool = require("../config/tidb");
const adminAuth = require("../middleware/adminAuth");
const { wordLimiter } = require("../middleware/rateLimits");

// In-memory cache for public word of the day
let cachedWord = null;
let cacheDate = null;

// Public endpoint
router.get("/word-of-the-day", wordLimiter, async (req, res) => {
    try {
        const today = new Date();
        // Use local time for YYYY-MM-DD
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        if (cachedWord && cacheDate === dateStr) {
            return res.json({ success: true, word: cachedWord });
        }

        // Try to fetch for today's date
        let [rows] = await pool.query(
            "SELECT * FROM word_of_the_day WHERE date = ? LIMIT 1",
            [dateStr]
        );

        if (rows.length > 0) {
            cachedWord = rows[0];
            cacheDate = dateStr;
            return res.json({ success: true, word: cachedWord });
        }

        // Fallback to default words (where date is NULL or empty)
        [rows] = await pool.query(
            "SELECT * FROM word_of_the_day WHERE date IS NULL OR date = '' ORDER BY id ASC"
        );

        if (rows.length > 0) {
            const index = today.getDate() % rows.length;
            cachedWord = rows[index];
            cacheDate = dateStr;
            return res.json({ success: true, word: cachedWord });
        }

        // Ultimate fallback if DB is completely empty
        const ultimateFallback = {
            bn: "অভিসার",
            en: "A secret rendezvous, especially romantic",
            pronunciation: "Obhishar"
        };
        cachedWord = ultimateFallback;
        cacheDate = dateStr;
        
        return res.json({ success: true, word: ultimateFallback });

    } catch (error) {
        console.error("Word of the day error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch word of the day" });
    }
});

// Admin endpoints
router.get("/admin/words", adminAuth, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM word_of_the_day ORDER BY id DESC");
        res.json({ success: true, words: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

router.post("/admin/words", adminAuth, async (req, res) => {
    try {
        const { date, bn, en, pronunciation } = req.body;
        if (!bn || !en || !pronunciation) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const queryDate = date ? date : null;

        if (queryDate) {
            const [existing] = await pool.query(
                "SELECT id FROM word_of_the_day WHERE date = ? LIMIT 1",
                [queryDate]
            );
            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: "A word is already scheduled for this date. Please edit the existing word instead." });
            }
        }

        await pool.query(
            "INSERT INTO word_of_the_day (date, bn, en, pronunciation) VALUES (?, ?, ?, ?)",
            [queryDate, bn, en, pronunciation]
        );

        cacheDate = null; // Invalidate cache

        res.json({ success: true, message: "Word added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

router.put("/admin/words/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, bn, en, pronunciation } = req.body;
        if (!bn || !en || !pronunciation) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const queryDate = date ? date : null;

        if (queryDate) {
            const [existing] = await pool.query(
                "SELECT id FROM word_of_the_day WHERE date = ? AND id != ? LIMIT 1",
                [queryDate, id]
            );
            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: "Another word is already scheduled for this date." });
            }
        }

        await pool.query(
            "UPDATE word_of_the_day SET date = ?, bn = ?, en = ?, pronunciation = ? WHERE id = ?",
            [queryDate, bn, en, pronunciation, id]
        );

        cacheDate = null; // Invalidate cache

        res.json({ success: true, message: "Word updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

router.delete("/admin/words/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM word_of_the_day WHERE id = ?", [id]);
        
        cacheDate = null; // Invalidate cache

        res.json({ success: true, message: "Word deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

module.exports = router;
