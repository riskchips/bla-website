const express = require("express")

const {
    boardLimiter,
    adminLimiter
} = require("../middleware/rateLimits")

const adminAuth = require("../middleware/adminAuth")
// SUPABASE COMMENTED OUT:
// const supabase = require("../config/supabase")
// TIDB IMPORT:
const pool = require("../config/tidb")
const crypto = require("crypto")

const router = express.Router()

router.get(
    "/board",
    boardLimiter,
    async (req, res) => {
        try {
            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("team")
                .select("*")
                .order("board_year", { ascending: false })
                .order("sort_order", { ascending: true })

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
            */

            // TIDB LOGIC
            const [rows] = await pool.query(
                "SELECT * FROM team ORDER BY board_year DESC, sort_order ASC"
            )

            return res.json({
                success: true,
                team: rows
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
    "/create/board",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { name, role, description, image, board_year } = req.body

            if (!name || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Name and role are required"
                })
            }

            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("team")
                .insert({
                    name: name.trim(),
                    role: role.trim(),
                    description: description ? description.trim() : "",
                    image: image ? image.trim() : "",
                    board_year: board_year ? board_year.trim() : "2026-27"
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
            */

            // TIDB LOGIC
            const id = crypto.randomUUID(); // generate UUID for id since TiDB schema uses VARCHAR(50) for id
            const newName = name.trim();
            const newRole = role.trim();
            const newDesc = description ? description.trim() : "";
            const newImage = image ? image.trim() : "";
            const newYear = board_year ? board_year.trim() : "2026-27";
            
            // Get max sort order to append at the end
            const [orderRows] = await pool.query("SELECT MAX(sort_order) as maxOrder FROM team");
            const newSortOrder = (orderRows[0].maxOrder || 0) + 1;

            await pool.execute(
                `INSERT INTO team (id, name, role, description, image, board_year, sort_order, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                [id, newName, newRole, newDesc, newImage, newYear, newSortOrder]
            )

            const [rows] = await pool.query("SELECT * FROM team WHERE id = ?", [id]);

            return res.json({
                success: true,
                member: rows[0]
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
    "/delete/board/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            /* SUPABASE LOGIC
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
            */

            // TIDB LOGIC
            await pool.execute("DELETE FROM team WHERE id = ?", [id]);

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

router.put(
    "/update/board/order",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { orders } = req.body;
            if (!Array.isArray(orders)) {
                return res.status(400).json({ success: false, message: "Orders must be an array" });
            }

            /* SUPABASE LOGIC
            const updates = orders.map(async ({ id, sort_order }) => {
                return supabase.from("team").update({ sort_order }).eq("id", id);
            });

            await Promise.all(updates);
            */

            // TIDB LOGIC
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                for (const { id, sort_order } of orders) {
                    await connection.execute("UPDATE team SET sort_order = ? WHERE id = ?", [sort_order, id]);
                }
                await connection.commit();
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }

            return res.json({ success: true, message: "Order updated" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
);

router.put(
    "/update/board/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, role, description, image, board_year } = req.body;

            if (!name || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Name and role are required"
                })
            }

            /* SUPABASE LOGIC
            const { data, error } = await supabase
                .from("team")
                .update({
                    name: name.trim(),
                    role: role.trim(),
                    description: description ? description.trim() : "",
                    image: image ? image.trim() : "",
                    board_year: board_year ? board_year.trim() : "2026-27"
                })
                .eq("id", id)
                .select()
                .single();

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
            */

            // TIDB LOGIC
            const updateName = name.trim();
            const updateRole = role.trim();
            const updateDesc = description ? description.trim() : "";
            const updateImage = image ? image.trim() : "";
            const updateYear = board_year ? board_year.trim() : "2026-27";

            await pool.execute(
                `UPDATE team 
                 SET name = ?, role = ?, description = ?, image = ?, board_year = ?
                 WHERE id = ?`,
                [updateName, updateRole, updateDesc, updateImage, updateYear, id]
            )

            const [rows] = await pool.query("SELECT * FROM team WHERE id = ?", [id]);

            return res.json({
                success: true,
                member: rows[0]
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
);

module.exports = router