import { ServeOptions } from 'bun'
import BunServe from './src/bunServer'
import { PgConnectionAdapter } from './src/infra/database/PgConnectionAdapter'

interface MethodHandlersMap {
    get: () => void
    put: (request: Request) => void
    post: (request: Request) => void
}

type MethodHandler = 'get' | 'post' | 'put'

const bunInstance = BunServe.getInstance;
const connection = new PgConnectionAdapter();

const responseHandler: MethodHandlersMap = {
    get: bunInstance.get.bind(bunInstance, async () => {
        const systems = await connection.query('SELECT * FROM system order by id');
        return Response.json({ data: systems.rows })
    }),
    put: async (request: Request) => {
        return bunInstance.put(async () => {
            try {
                const body = await request.json();
                
                const query = 'UPDATE system SET coverage = $1 WHERE id = $2 RETURNING *';
                const result = await connection.query(query, [body.coverage, body.id]);
        
                if (result.rows && result.rows.length > 0) {
                    return Response.json({ data: result.rows[0], msg: 'Atualizado com sucesso' });
                } else {
                    throw new Error(`Sistema com ID ${body.id} não encontrado`);
                }
            } catch (error) {
                return new Response('Erro interno do servidor!', { status: 500 })
            }
            
        })
    },
    post: async (request: Request) => {
        return bunInstance.post(async () => {
            try {
                const body = await request.json();
                
                const newSystem = {
                    name: body.name,
                    coverage: body.coverage,
                };
                
                const query = 'INSERT INTO system (name, coverage) VALUES ($1, $2) RETURNING *';
                const result = await connection.query(query, [newSystem.name, newSystem.coverage]);
        
                return Response.json({ data: result.rows[0], msg: 'Cadastrado com sucesso' });
            } catch (error) {
                return new Response('Erro interno do servidor!', { status: 500 })
            }
        });
    },
}

const server = Bun.serve({
    port: Bun.env.PORT || 8000,
    async fetch(request: Request) {
        const url = new URL(request.url)
        const method = request.method.toLocaleLowerCase() as MethodHandler

        if (url.pathname === '/systems') {
            return responseHandler[method as MethodHandler](request)
        } else {
            return new Response('404!')
        }

    },
    error(error) {
        return new Response(`<pre>${error}\n${error.stack}</pre>`, {
            headers: {
                'Content-Type': 'text/html',
            },
        })
    },
} as ServeOptions);

console.log(`Listening on port ${server.port}`)
