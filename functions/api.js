export async function onRequest(context) {
    const { request, env } = context;
    const dbUrl = env.DATABASE_URL;

    if (!dbUrl) {
        return new Response(JSON.stringify({ error: "DATABASE_URL manquant" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    let cleanUrl = dbUrl.replace('postgresql://', '').split('?')[0];
    let [auth, hostAndDb] = cleanUrl.split('@');
    let [host, dbName] = hostAndDb.split('/');
    const apiUrl = `https://${host}/sql`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(auth)}`
    };

    try {
        if (request.method === 'GET') {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ query: "SELECT * FROM produits ORDER BY id DESC" })
            });
            const data = await res.json();
            return new Response(JSON.stringify(data.rows || data), { status: 200, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'POST') {
            const body = await request.json();
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ 
                    query: "INSERT INTO produits (nom, prix, devise, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                    params: [body.name, body.price, body.currency, body.desc, body.img]
                })
            });
            const data = await res.json();
            return new Response(JSON.stringify(data.rows ? data.rows[0] : data), { status: 201, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'DELETE') {
            const url = new URL(request.url);
            const id = url.searchParams.get("id");
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ query: "DELETE FROM produits WHERE id = $1", params: [id] })
            });
            const data = await res.json();
            return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response("Méthode non autorisée", { status: 405 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
