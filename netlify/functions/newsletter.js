
exports.handler = async (event) => {
    const json = (statusCode, data) => ({
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (event.httpMethod !== "POST") {
        return json(405, { error: "Method not allowed." });
    }


    let email;

    try {
        const data = JSON.parse(event.body || "{}");
        email = typeof data.email === "string" ? data.email.trim() : "";

        if (data.consent !== true) {
            return json(400, {
                error: "Please agree to receive the newsletter."
            });
        }
    } catch {
        return json(400, { error: "Invalid request." });
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json(400, { error: "Please enter a valid email address." });
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        console.error("BREVO_API_KEY is missing.");
        return json(500, { error: "Newsletter is temporarily unavailable." });
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                email,
                includeListIds: [3],
                templateId: 1,
                redirectionUrl: "https://filmoverse.netlify.app/#newsletter"
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Brevo request failed:", response.status, errorBody);
            return json(502, {
                error: "Unable to process your subscription. Please try again."
            });
        }

        return json(200, {
            message: "Check your inbox to confirm your subscription!"
        });

    } catch (error) {
        console.error("Newsletter request failed:", error.message);
        return json(500, {
            error: "Something went wrong. Please try again."
        });
    }
};
