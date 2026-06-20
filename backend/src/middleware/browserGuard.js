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

    const host = req.headers["x-forwarded-host"] || req.headers.host
    const expectedOrigin = process.env.FRONTEND_URL || `https://${host}`

    if (origin) {
        const isValidOrigin =
            (process.env.FRONTEND_URL && origin.startsWith(process.env.FRONTEND_URL)) ||
            origin.startsWith(expectedOrigin) ||
            origin.includes(host)

        if (!isValidOrigin) {
            return res.status(403).json({
                success: false,
                message: "Invalid Origin"
            })
        }
    }

    if (referer) {
        const isValidReferer =
            (process.env.FRONTEND_URL && referer.startsWith(process.env.FRONTEND_URL)) ||
            referer.startsWith(expectedOrigin) ||
            referer.includes(host)

        if (!isValidReferer) {
            return res.status(403).json({
                success: false,
                message: "Invalid Referer"
            })
        }
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