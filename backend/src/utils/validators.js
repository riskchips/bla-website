const validator = require("validator")

function normalizeIndianPhone(phone) {
    if (!phone) return null

    let digits = String(phone)
        .replace(/\D/g, "")

    if (digits.startsWith("91") && digits.length === 12) {
        digits = digits.slice(2)
    }

    if (digits.length !== 10) {
        return null
    }

    if (!/^[6-9]\d{9}$/.test(digits)) {
        return null
    }

    return digits
}

function sanitizeString(value) {
    if (typeof value !== "string") {
        return ""
    }

    return validator.escape(
        value
            .trim()
            .replace(/\s+/g, " ")
    )
}

function validateContact(data) {
    let {
        name,
        email,
        phone,
        details
    } = data

    name = sanitizeString(name)
    details = sanitizeString(details)

    if (!name) {
        return "Name is required"
    }

    if (!details) {
        return "Details are required"
    }

    if (name.length < 2) {
        return "Name too short"
    }

    if (name.length > 100) {
        return "Name too long"
    }

    if (details.length < 5) {
        return "Details too short"
    }

    if (details.length > 5000) {
        return "Details too long"
    }

    if (!email && !phone) {
        return "Email or phone required"
    }

    if (email) {
        email = email.trim().toLowerCase()

        if (email.length > 254) {
            return "Email too long"
        }

        if (!validator.isEmail(email)) {
            return "Invalid email"
        }
    }

    if (phone) {
        if (!normalizeIndianPhone(phone)) {
            return "Invalid phone"
        }
    }

    return null
}

function validateNotification(data) {
    const {
        title,
        details,
        date,
        buttons
    } = data

    if (
        typeof title !== "string" ||
        typeof details !== "string" ||
        typeof date !== "string"
    ) {
        return "Invalid fields"
    }

    const cleanTitle = title.trim()
    const cleanDetails = details.trim()
    const cleanDate = date.trim()

    if (!cleanTitle) {
        return "Title required"
    }

    if (!cleanDetails) {
        return "Details required"
    }

    if (!cleanDate) {
        return "Date required"
    }

    if (cleanTitle.length > 200) {
        return "Title too long"
    }

    if (cleanDetails.length > 10000) {
        return "Details too long"
    }

    if (cleanDate.length > 100) {
        return "Date too long"
    }

    if (
        buttons &&
        !Array.isArray(buttons)
    ) {
        return "Buttons must be array"
    }

    if (
        buttons &&
        buttons.length > 20
    ) {
        return "Too many buttons"
    }

    if (buttons) {
        for (const button of buttons) {
            if (
                typeof button !== "object" ||
                !button
            ) {
                return "Invalid button"
            }

            if (
                typeof button.name !== "string" ||
                typeof button.link !== "string"
            ) {
                return "Invalid button"
            }

            if (
                button.name.trim().length < 1 ||
                button.name.length > 100
            ) {
                return "Invalid button name"
            }

            if (
                button.link.length > 2000
            ) {
                return "Button link too long"
            }

            try {
                const url = new URL(button.link)

                if (
                    url.protocol !== "https:" &&
                    url.protocol !== "http:"
                ) {
                    return "Invalid button url"
                }
            } catch {
                return "Invalid button url"
            }
        }
    }

    return null
}

function validateHelp(data) {
const {
name,
email,
phone,
category,
subject,
details
} = data


const allowedCategories = [
    "General Help",
    "Membership",
    "Website Issue",
    "Complaint",
    "Suggestion",
    "Event Issue",
    "Other"
]

if (!name) {
    return "Name is required"
}

if (!subject) {
    return "Subject is required"
}

if (!details) {
    return "Details are required"
}

if (!category) {
    return "Category is required"
}

if (!allowedCategories.includes(category)) {
    return "Invalid category"
}

if (!email && !phone) {
    return "Email or phone required"
}

if (subject.trim().length < 3) {
    return "Subject too short"
}

if (subject.length > 200) {
    return "Subject too long"
}

return validateContact({
    name,
    email,
    phone,
    details
})


}

module.exports = {
validateContact,
validateNotification,
validateHelp,
normalizeIndianPhone,
sanitizeString
}


