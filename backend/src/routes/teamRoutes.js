const express = require("express")

const {
    teamLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

const adminAuth = require("../middleware/adminAuth")
const supabase = require("../config/supabase")

const router = express.Router()

router.get(
    "/team",
    teamLimiter,
    async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("team")
                .select("*")
                .order("created_at", { ascending: true })

            if (error) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                })
            }

            return res.json({
                success: true,
                team: data
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

router.post(
    "/create/team",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { name, role, description, image } = req.body

            if (!name || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Name and role are required"
                })
            }

            const { data, error } = await supabase
                .from("team")
                .insert({
                    name: name.trim(),
                    role: role.trim(),
                    description: description ? description.trim() : "",
                    image: image ? image.trim() : ""
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
                member: data
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
    "/delete/team/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            const { error } = await supabase
                .from("team")
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
                message: "Team member deleted"
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