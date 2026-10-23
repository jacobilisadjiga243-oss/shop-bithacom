import { Client } from '@neondatabase/serverless';

export async function onRequest(context) {
    const { request, env } = context;
    const client = new Client(env.DATABASE_URL);
    const url = new URL(request.url);

    try {
        await client.connect();

        if (request.method === 'GET') {
            const { rows } = await client.query('SELECT * FROM voyages ORDER BY id DESC');
            return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'POST') {
            const body = await request.json();
            const imageUrl = body.img && body.img.trim() !== "" ? body.img : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500";
            
            const { rows } = await client.query(
                'INSERT INTO voyages (type_voyage, destination, date_depart, prix, devise, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [body.type, body.destination, body.date, body.price, body.currency, body.desc || '', imageUrl]
            );
            return new Response(JSON.stringify(rows[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'DELETE') {
            const id = url.searchParams.get("id");
            await client.query('DELETE FROM voyages WHERE id = $1', [id]);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response("Méthode non autorisée", { status: 405 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    } finally {
        await client.end();
    }
}
