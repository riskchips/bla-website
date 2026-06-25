const express = require("express")

const {
    boardLimiter, 
    adminLimiter
} = require("../middleware/rateLimits")

const adminAuth = require("../middleware/adminAuth")
const pool = require("../config/tidb")

const router = express.Router()

// In-memory cache for gallery
let galleryCache = null;

const clearGalleryCache = () => {
    galleryCache = null;
};

router.get(
    "/gallery",
    boardLimiter,
    async (req, res) => {
        try {
            // Serve from cache if available
            if (galleryCache) {
                return res.json({
                    success: true,
                    gallery: galleryCache
                });
            }

            const [rows] = await pool.query(
                "SELECT * FROM gallery ORDER BY created_at DESC"
            )

            // Update cache
            galleryCache = rows;

            return res.json({
                success: true,
                gallery: rows
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
    "/create/gallery",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { images } = req.body // images should be an array of { image_url, caption }
            
            if (!images || !Array.isArray(images) || images.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Array of images is required"
                })
            }

            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                
                for (const img of images) {
                    const url = img.image_url ? img.image_url.trim() : "";
                    const caption = img.caption ? img.caption.trim() : "";
                    if (url) {
                        await connection.execute(
                            `INSERT INTO gallery (image_url, caption) VALUES (?, ?)`,
                            [url, caption]
                        );
                    }
                }
                
                await connection.commit();
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }

            // Clear the cache since a new photo was uploaded
            clearGalleryCache();

            return res.json({
                success: true,
                message: "Gallery updated successfully"
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
    "/delete/gallery/:id",
    adminAuth,
    adminLimiter,
    async (req, res) => {
        try {
            const { id } = req.params

            await pool.execute("DELETE FROM gallery WHERE id = ?", [id]);

            // Clear the cache since a photo was deleted
            clearGalleryCache();

            return res.json({
                success: true,
                message: "Image deleted"
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
