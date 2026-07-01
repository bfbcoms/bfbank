export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Bright Future Bank — Service interruption</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { font: 15px/1.6 "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background: #000000; color: #ffffff; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; -webkit-font-smoothing: antialiased; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: 2.5rem 2rem; }
      .eyebrow { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #dbb149; margin: 0 0 1.5rem; }
      h1 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 0.75rem; }
      p { color: rgba(255,255,255,0.65); margin: 0 0 2rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 1.5rem; font: 500 12px/1 "Inter", sans-serif; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: opacity 0.15s ease; }
      .primary { background: #dbb149; color: #000000; }
      .primary:hover { opacity: 0.9; }
      .secondary { background: transparent; color: #ffffff; border-color: rgba(255,255,255,0.25); }
      .secondary:hover { border-color: #dbb149; color: #dbb149; }
    </style>
  </head>
  <body>
    <div class="card">
      <p class="eyebrow">Bright Future Bank</p>
      <h1>Service interruption</h1>
      <p>Our systems couldn't complete your request. Your account and funds are unaffected.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Return home</a>
      </div>
    </div>
  </body>
</html>`;
}
