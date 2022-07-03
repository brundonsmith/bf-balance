import * as path from "https://deno.land/std@0.107.0/path/mod.ts"
import * as fs from "https://deno.land/std@0.107.0/fs/mod.ts"
import * as server from 'https://deno.land/std@v0.139.0/http/server.ts';

const projectPath = path.dirname(path.fromFileUrl(import.meta.url))

const extToContentType: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
}

let total = 0

const port = 8000
const s = new server.Server({
    handler: async req => {
        const url = new URL(req.url)
        const pathname = url.pathname

        if (pathname === '/') {
            // index.html
            const content = await Deno.readTextFile(path.resolve(projectPath, './static/index.html'))
            return new Response(content, { headers: { 'Content-Type': 'text/html' } })
        } else if (pathname === '/api/current') {
            return new Response(String(total))
        } else if (pathname === '/api/add') {
            const newAmount = Number(url.searchParams.get('amount'))

            if (!isNaN(newAmount)) {
                total += newAmount
                return new Response(String(total))
            }

            return new Response(String(total), { status: 400 })
        } else if (pathname === '/api/reset') {
            total = 0

            return new Response(String(total))
        } else {
            // serve static asset
            const assetPath = path.resolve(projectPath, '.' + pathname)
            if (await fs.exists(assetPath)) {
                const content = await Deno.readTextFile(assetPath)

                return new Response(content, { headers: { 'Content-Type': extToContentType[path.extname(assetPath)] } })
            }
        }

        return new Response('Not found!', { status: 404 })
    }
})

s.serve(Deno.listen({ port }))
console.log(`Listening on http://localhost:${port}/`)