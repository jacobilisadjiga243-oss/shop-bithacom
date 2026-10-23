import { Client } from '@neondatabase/serverless';

export async function onRequest(context) {
    const { request, env } = context;
    const client = new Client(env.DATABASE_URL);
    const url = new URL(request.url);

    try {
        await client.connect();

        if (request.method === 'GET') {
            const { rows } = await client.query('SELECT * FROM adresses ORDER BY id ASC');
            return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'POST') {
            const body = await request.json();
            const { rows } = await client.query(
                'INSERT INTO adresses (nom_lieu, type_lieu, adresse) VALUES ($1, $2, $3) RETURNING *',
                [body.nom, body.type, body.adresse]
            );
            return new Response(JSON.stringify(rows[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'DELETE') {
            const id = url.searchParams.get("id");
            await client.query('DELETE FROM adresses WHERE id = $1', [id]);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response("Méthode non autorisée", { status: 405 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    } finally {
        await client.end();
    }
}
