const express = require("express")

const {
    boardLimiter, 
    adminLimiter
} = require("../middleware/rateLimits")

const adminAuth = require("../middleware/adminAuth")
const pool = require("../config/tidb")
const crypto = require("crypto")

const router = express.Router()

router.get(
    "/team",
    boardLimiter,
    async (req, res) => {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM current_team ORDER BY sort_order ASC"
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
    "/create/team",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { name, role, description, image, category } = req.body

            if (!name || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Name and role are required"
                })
            }

            const newName = name.trim();
            const newRole = role.trim();
            const newDesc = description ? description.trim() : "";
            const newImage = image ? image.trim() : "";
            const newCategory = category ? category.trim() : "senior";
            
            let insertedId = crypto.randomUUID();
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                
                const [orderRows] = await connection.query("SELECT MAX(sort_order) as maxOrder FROM current_team FOR UPDATE");
                const newSortOrder = (orderRows[0].maxOrder || 0) + 1;

                await connection.execute(
                    `INSERT INTO current_team (id, name, role, description, image, category, sort_order, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [insertedId, newName, newRole, newDesc, newImage, newCategory, newSortOrder]
                );
                
                await connection.commit();
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }

            const [rows] = await pool.query("SELECT * FROM current_team WHERE id = ?", [insertedId]);

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
    "/delete/team/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            await pool.execute("DELETE FROM current_team WHERE id = ?", [id]);

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
    "/update/team/order",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { orders } = req.body;
            if (!Array.isArray(orders)) {
                return res.status(400).json({ success: false, message: "Orders must be an array" });
            }

            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                for (const { id, sort_order } of orders) {
                    await connection.execute("UPDATE current_team SET sort_order = ? WHERE id = ?", [sort_order, id]);
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
    "/update/team/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, role, description, image, category } = req.body;

            if (!name || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Name and role are required"
                })
            }

            const updateName = name.trim();
            const updateRole = role.trim();
            const updateDesc = description ? description.trim() : "";
            const updateImage = image ? image.trim() : "";
            const updateCategory = category ? category.trim() : "senior";

            await pool.execute(
                `UPDATE current_team 
                 SET name = ?, role = ?, description = ?, image = ?, category = ?
                 WHERE id = ?`,
                [updateName, updateRole, updateDesc, updateImage, updateCategory, id]
            )

            const [rows] = await pool.query("SELECT * FROM current_team WHERE id = ?", [id]);

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
