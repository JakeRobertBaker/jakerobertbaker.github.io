import type { APIRoute } from 'astro';
import { loadRegistry } from '../lib/registry';

export const GET: APIRoute = async () => new Response(JSON.stringify(await loadRegistry()), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
