// Cloudflare Worker for Secure Image Uploads

export default {
    async fetch(request, env) {
        // Handle CORS
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "PUT, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Secret",
                },
            });
        }

        // Only allow PUT requests
        if (request.method !== "PUT") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        // Simple Admin Secret Check (Set this in your worker environment variables later)
        // For now, we'll accept a header or query param. In production, use `wrangler secret put ADMIN_SECRET`
        // const secret = request.headers.get("X-Admin-Secret");
        // if (secret !== env.ADMIN_SECRET) {
        //   return new Response("Unauthorized", { status: 401 });
        // }

        const url = new URL(request.url);
        const key = url.pathname.slice(1); // Use path as filename

        if (!key) {
            return new Response("Filename missing", { status: 400 });
        }

        try {
            // Put object into R2 bucket
            await env.BUCKET.put(key, request.body);

            return new Response(JSON.stringify({
                success: true,
                key: key,
                url: `https://pub-f797be67514a4a91ab36b6c15ac2196f.r2.dev/${key}`
            }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { "Access-Control-Allow-Origin": "*" }
            });
        }
    },
};
