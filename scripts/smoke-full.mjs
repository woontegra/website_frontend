process.env.SMOKE_RESPONSIVE = '1'
process.env.SMOKE_CONSENT = '1'

await import('./smoke-site.mjs')
