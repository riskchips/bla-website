const express = require("express")

const router = express.Router()

const supabase = require("../config/supabase")

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

        const errorMessage =
            validateHelp(req.body)

        if (errorMessage) {
            return res.status(400).json({
                success: false,
                message: errorMessage
            })
        }

        const unixTimestamp = Date.now()

        const {
            data,
            error
        } = await supabase
            .from("help_requests")
            .insert({
                name: name.trim(),
                email: email
                    ? email.trim().toLowerCase()
                    : null,
                phone: phone
                    ? normalizeIndianPhone(phone)
                    : null,
                category: category.trim(),
                subject: subject.trim(),
                details: details.trim(),
                ip_address: req.ip,
                created_at: new Date().toISOString()
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
            help: data
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
"/view/help",
adminAuth,
adminLimiter,
async (req, res) => {
try {
let page = Number(req.query.page) || 1

        if (page < 1) {
            page = 1
        }

        const limit = 30

        const from = (page - 1) * limit
        const to = from + limit - 1

        const {
            data,
            count,
            error
        } = await supabase
            .from("help_requests")
            .select("*", {
                count: "exact"
            })
            .order("created_at", {
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
            helpRequests: data
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
    "/delete/help/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            const { error } = await supabase
                .from("help_requests")
                .delete()
                .eq("id", id)

            if (error) {
                console.error(error)
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.json({
                success: true,
                message: "Help request deleted"
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