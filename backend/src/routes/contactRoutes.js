const express = require("express")

const router = express.Router()

const supabase = require("../config/supabase")

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

            const captchaResult =
                await captchaResponse.json()

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

            const tenMinutesAgo =
                Date.now() - (10 * 60 * 1000)

            const {
                data: existing,
                error: duplicateError
            } = await supabase
                .from("contacts")
                .select("id")
                .eq("name", cleanName)
                .eq("details", cleanDetails)
                .gte(
                    "unix_timestamp",
                    tenMinutesAgo
                )
                .limit(1)

            if (duplicateError) {
                console.error(duplicateError)

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            if (existing?.length) {
                return res.status(429).json({
                    success: false,
                    message: "Duplicate submission detected"
                })
            }

            const unixTimestamp = Date.now()

            const {
                data,
                error
            } = await supabase
                .from("contacts")
                .insert({
                    name: cleanName,
                    email: email
                        ? email.trim().toLowerCase()
                        : null,
                    phone: phone
                        ? normalizeIndianPhone(phone)
                        : null,
                    details: cleanDetails,
                    unix_timestamp: unixTimestamp
                })
                .select()
                .single()

            if (error) {
                console.error(error)

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.status(201).json({
                success: true,
                contact: data
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

            if (page < 1) {
                page = 1
            }

            if (limit < 1) {
                limit = 1
            }

            if (limit > 30) {
                limit = 30
            }

            const from = (page - 1) * limit
            const to = from + limit - 1

            const {
                data,
                count,
                error
            } = await supabase
                .from("contacts")
                .select("*", {
                    count: "exact"
                })
                .order("unix_timestamp", {
                    ascending: false
                })
                .range(from, to)

            if (error) {
                console.error(error)

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.json({
                success: true,
                page,
                limit,
                total: count,
                totalPages: Math.ceil(
                    (count || 0) / limit
                ),
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

module.exports = router