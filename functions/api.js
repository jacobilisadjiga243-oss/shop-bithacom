import { Client } from '@neondatabase/serverless';

export async function onRequest(context) {
    const { request, env } = context;
    const client = new Client(env.DATABASE_URL);
    const url = new URL(request.url);

    try {
        await client.connect();

        // ===== GESTION DES PRODUITS =====
        if (url.pathname === '/api' || url.pathname === '/api/produits') {
            if (request.method === 'GET') {
                const { rows } = await client.query('SELECT * FROM produits ORDER BY id DESC');
                return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
            
            } else if (request.method === 'POST') {
                const body = await request.json();
                const { rows } = await client.query(
                    'INSERT INTO produits (nom, prix, devise, description, image_url, categorie) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [body.name, body.price, body.currency, body.desc, body.img, body.category || 'standard']
                );
                return new Response(JSON.stringify(rows[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
            
            } else if (request.method === 'DELETE') {
                const id = url.searchParams.get("id");
                await client.query('DELETE FROM produits WHERE id = $1', [id]);
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }
        }

        // ===== GESTION DES AVIS =====
        if (url.pathname === '/api/avis') {
            if (request.method === 'GET') {
                const { rows } = await client.query('SELECT * FROM avis_clients ORDER BY id DESC');
                return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else if (request.method === 'POST') {
                const body = await request.json();
                const { rows } = await client.query(
                    'INSERT INTO avis_clients (nom_client, commentaire, note) VALUES ($1, $2, $3) RETURNING *',
                    [body.nom, body.commentaire, body.note]
                );
                return new Response(JSON.stringify(rows[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
            } else if (request.method === 'DELETE') {
                const id = url.searchParams.get("id");
                await client.query('DELETE FROM avis_clients WHERE id = $1', [id]);
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }
        }

        return new Response("Méthode non autorisée", { status: 405 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    } finally {
        await client.end();
    }
}
