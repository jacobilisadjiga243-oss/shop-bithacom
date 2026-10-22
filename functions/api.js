export async function onRequest(context) {
    const { request, env } = context;
    const dbUrl = env.DATABASE_URL;

    if (!dbUrl) {
        return new Response(JSON.stringify({ error: "Base de données non configurée" }), { status: 500 });
    }

    const neonApiUrl = dbUrl.replace('postgresql://', 'https://').split('@')[1].split('/')[0];
    const headers = { 'Content-Type': 'application/json' };
    const auth = btoa(dbUrl.split('://')[1].split('@')[0]);

    if (request.method === 'GET') {
        const res = await fetch(`https://${neonApiUrl}/sql`, {
            method: 'POST',
            headers: { ...headers, 'Authorization': `Basic ${auth}` },
            body: JSON.stringify({ query: "SELECT * FROM produits ORDER BY id DESC" })
        });
        const data = await res.json();
        return new Response(JSON.stringify(data.rows || []), { status: 200, headers: { 'Content-Type': 'application/json' } });
    
    } else if (request.method === 'POST') {
        const body = await request.json();
        const res = await fetch(`https://${neonApiUrl}/sql`, {
            method: 'POST',
            headers: { ...headers, 'Authorization': `Basic ${auth}` },
            body: JSON.stringify({ 
                query: "INSERT INTO produits (nom, prix, devise, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                params: [body.name, body.price, body.currency, body.desc, body.img]
            })
        });
        const data = await res.json();
        return new Response(JSON.stringify(data.rows[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
    
    } else if (request.method === 'DELETE') {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        await fetch(`https://${neonApiUrl}/sql`, {
            method: 'POST',
            headers: { ...headers, 'Authorization': `Basic ${auth}` },
            body: JSON.stringify({ query: "DELETE FROM produits WHERE id = $1", params: [id] })
        });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response("Méthode non autorisée", { status: 405 });
}
