import { Client } from '@neondatabase/serverless';

export async function onRequest(context) {
    const { request, env } = context;
    const client = new Client(env.DATABASE_URL);
    const url = new URL(request.url);

    try {
        await client.connect();

        if (request.method === 'GET') {
            const { rows } = await client.query('SELECT * FROM produits ORDER BY id DESC');
            return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'POST') {
            const body = await request.json();
            const { rows } = await client.query(
                'INSERT INTO produits (nom, prix, devise, description, image_url, categorie) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [body.name, body.price, body.currency, body.desc || '', body.img, body.category || 'standard']
            );
            return new Response(JSON.stringify(rows[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
        
        } else if (request.method === 'PUT') {
            const body = await request.json();
            const { rows } = await client.query(
                'UPDATE produits SET nom=$1, prix=$2, devise=$3, description=$4, image_url=$5, categorie=$6 WHERE id=$7 RETURNING *',
                [body.name, body.price, body.currency, body.desc || '', body.img, body.category, body.id]
            );
            return new Response(JSON.stringify(rows[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });

        } else if (request.method === 'DELETE') {
            const id = url.searchParams.get("id");
            await client.query('DELETE FROM produits WHERE id = $1', [id]);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
        // ===== STATISTIQUES (Pour l'admin) =====
        if (url.pathname === '/api/stats') {
            const produits = await client.query('SELECT COUNT(*) FROM produits');
            const avisTotal = await client.query('SELECT COUNT(*) FROM avis_clients');
            const avisAttente = await client.query('SELECT COUNT(*) FROM avis_clients WHERE approuve = false');
            
            return new Response(JSON.stringify({
                produits: parseInt(produits.rows[0].count),
                avisTotal: parseInt(avisTotal.rows[0].count),
                avisAttente: parseInt(avisAttente.rows[0].count)
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        // ===== STATISTIQUES (Pour l'admin) =====
        if (url.pathname === '/api/stats') {
            const produits = await client.query('SELECT COUNT(*) FROM produits');
            const avisTotal = await client.query('SELECT COUNT(*) FROM avis_clients');
            const avisAttente = await client.query('SELECT COUNT(*) FROM avis_clients WHERE approuve = false');
            
            return new Response(JSON.stringify({
                produits: parseInt(produits.rows[0].count),
                avisTotal: parseInt(avisTotal.rows[0].count),
                avisAttente: parseInt(avisAttente.rows[0].count)
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response("Méthode non autorisée", { status: 405 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    } finally {
        await client.end();
    }
}


