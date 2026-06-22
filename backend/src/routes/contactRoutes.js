const express = require("express")
const router = express.Router()

// SUPABASE LOGIC COMMENTED OUT
// const supabase = require("../config/supabase")
const pool = require("../config/tidb")

const adminAuth = require("../middleware/adminAuth")
const browserGuard = require("../middleware/browserGuard")

const {
    contactLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

const {
    validateContact,
    normalizeIndianPhone
} = require("../utils/validators")

router.post(
    "/contact",
    browserGuard,
    contactLimiter,
    async (req, res) => {
        try {
            const {
                name,
                email,
                phone,
                details,
                turnstileToken
            } = req.body

            if (!turnstileToken) {
                return res.status(400).json({
                    success: false,
                    message: "Captcha required"
                })
            }

            const captchaResponse = await fetch(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        secret: process.env.TURNSTILE_SECRET_KEY,
                        response: turnstileToken
                    })
                }
            )

            const captchaResult = await captchaResponse.json()

            if (!captchaResult.success) {
                return res.status(400).json({
                    success: false,
                    message: "Captcha verification failed"
                })
            }

            const errorMessage = validateContact(req.body)

            if (errorMessage) {
                return res.status(400).json({
                    success: false,
                    message: errorMessage
                })
            }

            const cleanName = name.trim()
            const cleanDetails = details.trim()

            const tenMinutesAgo = Date.now() - (10 * 60 * 1000)

            /* SUPABASE LOGIC
            const {
                data: existing,
                error: duplicateError
            } = await supabase
                .from("contacts")
                .select("id")
                .eq("name", cleanName)
                .eq("details", cleanDetails)
                .gte("unix_timestamp", tenMinutesAgo)
                .limit(1)

            if (duplicateError) {
                console.error(duplicateError)
                return res.status(500).json({ success: false, message: "Database Error" })
            }

            if (existing?.length) {
                return res.status(429).json({ success: false, message: "Duplicate submission detected" })
            }
            */

            // TIDB LOGIC
            // Note: Make sure your contacts table has 'phone', 'details', and 'unix_timestamp' columns in TiDB!
            const [existing] = await pool.query(
                "SELECT id FROM contacts WHERE name = ? AND details = ? AND unix_timestamp >= ? LIMIT 1",
                [cleanName, cleanDetails, tenMinutesAgo]
            );

            if (existing.length > 0) {
                return res.status(429).json({
                    success: false,
                    message: "Duplicate submission detected"
                })
            }

            const unixTimestamp = Date.now()
            const cleanEmail = email ? email.trim().toLowerCase() : null;
            const cleanPhone = phone ? normalizeIndianPhone(phone) : null;

            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("contacts")
                .insert({
                    name: cleanName,
                    email: cleanEmail,
                    phone: cleanPhone,
                    details: cleanDetails,
                    unix_timestamp: unixTimestamp
                })
                .select()
                .single()
            */

            // TIDB LOGIC
            const [insertResult] = await pool.execute(
                `INSERT INTO contacts (name, email, phone, details, unix_timestamp) 
                 VALUES (?, ?, ?, ?, ?)`,
                [cleanName, cleanEmail, cleanPhone, cleanDetails, unixTimestamp]
            );

            const [newRows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [insertResult.insertId]);

            return res.status(201).json({
                success: true,
                contact: newRows[0]
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
    "/get/contact",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            let page = Number(req.query.page) || 1
            let limit = Number(req.query.limit) || 30

            if (page < 1) page = 1;
            if (limit < 1) limit = 1;
            if (limit > 30) limit = 30;

            const offset = (page - 1) * limit;

            /* SUPABASE LOGIC
            const from = (page - 1) * limit
            const to = from + limit - 1
            const { data, count, error } = await supabase
                .from("contacts")
                .select("*", { count: "exact" })
                .order("unix_timestamp", { ascending: false })
                .range(from, to)
            */

            // TIDB LOGIC
            const [countRows] = await pool.query("SELECT COUNT(*) as total FROM contacts");
            const count = countRows[0].total;

            const [data] = await pool.query(
                "SELECT * FROM contacts ORDER BY unix_timestamp DESC LIMIT ? OFFSET ?",
                [limit, offset]
            );

            return res.json({
                success: true,
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
                contacts: data
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
    "/delete/contact/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            /* SUPABASE LOGIC
            const { error } = await supabase
                .from("contacts")
                .delete()
                .eq("id", id)
            */

            // TIDB LOGIC
            await pool.execute("DELETE FROM contacts WHERE id = ?", [id]);

            return res.json({
                success: true,
                message: "Contact deleted"
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