const express = require("express")
const router = express.Router()

// SUPABASE LOGIC COMMENTED OUT
// const supabase = require("../config/supabase")
const pool = require("../config/tidb")

const adminAuth = require("../middleware/adminAuth")
const browserGuard = require("../middleware/browserGuard")

const {
    helpLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

const {
    validateHelp,
    normalizeIndianPhone
} = require("../utils/validators")

router.post(
    "/submit/help",
    browserGuard,
    helpLimiter,
    async (req, res) => {
        try {
            const {
                name,
                email,
                phone,
                category,
                subject,
                details,
                turnstileToken
            } = req.body

            if (!turnstileToken) {
                return res.status(400).json({ success: false, message: "Captcha required" })
            }

            const captchaResponse = await fetch(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        secret: process.env.TURNSTILE_SECRET_KEY,
                        response: turnstileToken
                    })
                }
            )

            const captchaResult = await captchaResponse.json()

            if (!captchaResult.success) {
                return res.status(400).json({ success: false, message: "Captcha verification failed" })
            }

            const errorMessage = validateHelp(req.body)

            if (errorMessage) {
                return res.status(400).json({ success: false, message: errorMessage })
            }

            const cleanName = name.trim();
            const cleanEmail = email ? email.trim().toLowerCase() : null;
            const cleanPhone = phone ? normalizeIndianPhone(phone) : null;
            const cleanCategory = category.trim();
            const cleanSubject = subject.trim();
            const cleanDetails = details.trim();
            const ipAddress = req.ip;
            const createdAt = new Date().toISOString();

            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("help_requests")
                .insert({
                    name: cleanName,
                    email: cleanEmail,
                    phone: cleanPhone,
                    category: cleanCategory,
                    subject: cleanSubject,
                    details: cleanDetails,
                    ip_address: ipAddress,
                    created_at: createdAt
                })
                .select()
                .single()
            */

            // TIDB LOGIC
            // Ensure help_requests table in TiDB has these exact columns
            const [insertResult] = await pool.execute(
                `INSERT INTO help_requests (name, email, phone, category, subject, details, ip_address, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [cleanName, cleanEmail, cleanPhone, cleanCategory, cleanSubject, cleanDetails, ipAddress, createdAt]
            );

            const [rows] = await pool.query("SELECT * FROM help_requests WHERE id = ?", [insertResult.insertId]);

            return res.status(201).json({
                success: true,
                help: rows[0]
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Internal Server Error" })
        }
    }
)

router.get(
    "/view/help",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            let page = Number(req.query.page) || 1
            if (page < 1) page = 1;
            
            const limit = 30
            const offset = (page - 1) * limit;

            /* SUPABASE LOGIC
            const from = (page - 1) * limit
            const to = from + limit - 1
            const { data, count, error } = await supabase
                .from("help_requests")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(from, to)
            */

            // TIDB LOGIC
            const [countRows] = await pool.query("SELECT COUNT(*) as total FROM help_requests");
            const count = countRows[0].total;

            const [data] = await pool.query(
                "SELECT * FROM help_requests ORDER BY created_at DESC LIMIT ? OFFSET ?",
                [limit, offset]
            );

            return res.json({
                success: true,
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
                helpRequests: data
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Internal Server Error" })
        }
    }
)

router.delete(
    "/delete/help/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            /* SUPABASE LOGIC
            const { error } = await supabase
                .from("help_requests")
                .delete()
                .eq("id", id)
            */

            // TIDB LOGIC
            await pool.execute("DELETE FROM help_requests WHERE id = ?", [id]);

            return res.json({
                success: true,
                message: "Help request deleted"
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Internal Server Error" })
        }
    }
)

module.exports = router