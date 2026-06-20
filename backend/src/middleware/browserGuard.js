module.exports = (req, res, next) => {
    const origin = req.headers.origin
    const referer = req.headers.referer

    const userAgent =
        req.headers["user-agent"]

    const secFetchSite =
        req.headers["sec-fetch-site"]

    const secFetchMode =
        req.headers["sec-fetch-mode"]

    const secChUa =
        req.headers["sec-ch-ua"]

    const secChUaPlatform =
        req.headers["sec-ch-ua-platform"]

    if (!userAgent) {
        return res.status(403).json({
            success: false,
            message: "Invalid Browser"
        })
    }

    const expectedOrigin = process.env.FRONTEND_URL || `https://${req.headers.host}`

    if (
        origin &&
        !origin.startsWith(process.env.FRONTEND_URL) &&
        !origin.startsWith(expectedOrigin)
    ) {
        return res.status(403).json({
            success: false,
            message: "Invalid Origin"
        })
    }

    if (
        referer &&
        !referer.startsWith(process.env.FRONTEND_URL) &&
        !referer.startsWith(expectedOrigin)
    ) {
        return res.status(403).json({
            success: false,
            message: "Invalid Referer"
        })
    }

    if (!secFetchSite) {
        return res.status(403).json({
            success: false,
            message: "Missing Browser Metadata"
        })
    }

    if (!secFetchMode) {
        return res.status(403).json({
            success: false,
            message: "Missing Browser Metadata"
        })
    }

    if (!secChUa) {
        return res.status(403).json({
            success: false,
            message: "Missing Browser Metadata"
        })
    }

    if (!secChUaPlatform) {
        return res.status(403).json({
            success: false,
            message: "Missing Browser Metadata"
        })
    }

    next()
}