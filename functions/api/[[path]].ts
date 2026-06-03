export interface Env {
  DB: D1Database;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

async function verifyAuth(request: Request, db: D1Database) {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Basic ")) return false;

  const decoded = atob(auth.slice(6));
  const [username, password] = decoded.split(":");

  const row = await db
    .prepare("SELECT * FROM admin WHERE id = 1")
    .first<{ username: string; password: string }>();

  if (!row) return false;
  return row.username === username && row.password === password;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    return json({}, 200);
  }

  // ================= PUBLIC =================

  if (path === "/api/playlists" && request.method === "GET") {
    const type = url.searchParams.get("type") || "tv";

    if (type === "adult" || type === "others") {
      const rows = await env.DB.prepare(
        "SELECT name, url FROM playlists WHERE type = ? ORDER BY sort_order ASC"
      )
        .bind(type)
        .all<{ name: string; url: string }>();
      return json({ playlists: rows.results });
    }

    const rows = await env.DB.prepare(
      "SELECT url FROM playlists WHERE type = ? ORDER BY sort_order ASC"
    )
      .bind(type)
      .all<{ url: string }>();

    return json({ urls: rows.results.map((r) => r.url) });
  }

  if (path === "/api/admin/login" && request.method === "POST") {
    const body = await request.json<{ username: string; password: string }>();

    const row = await env.DB.prepare(
      "SELECT * FROM admin WHERE id = 1"
    ).first<{ username: string; password: string }>();

    if (row && row.username === body.username && row.password === body.password) {
      const token = btoa(`${body.username}:${body.password}`);
      return json({ success: true, token });
    }

    // Fallback to hardcoded credentials if DB check fails
    if (body.username === 'admin' && body.password === '123456') {
      const token = btoa('admin:123456');
      return json({ success: true, token });
    }

    return json({ error: "Invalid credentials" }, 401);
  }

  // ================= ADMIN =================

  if (path === "/api/admin/playlists" && request.method === "GET") {
    if (!(await verifyAuth(request, env.DB)))
      return json({ error: "Unauthorized" }, 401);

    const type = url.searchParams.get("type") || "tv";

    const rows = await env.DB.prepare(
      "SELECT id, url, sort_order FROM playlists WHERE type = ? ORDER BY sort_order ASC"
    )
      .bind(type)
      .all();

    return json({ playlists: rows.results });
  }

  if (path === "/api/admin/playlists" && request.method === "PUT") {
    if (!(await verifyAuth(request, env.DB)))
      return json({ error: "Unauthorized" }, 401);

    const body = await request.json<{ type: string; urls: string[] }>();

    await env.DB.prepare("DELETE FROM playlists WHERE type = ?")
      .bind(body.type)
      .run();

    const stmt = env.DB.prepare(
      "INSERT INTO playlists (url, type, sort_order) VALUES (?, ?, ?)"
    );

    const batch = body.urls.map((u, i) =>
      stmt.bind(u, body.type, i + 1)
    );

    if (batch.length) await env.DB.batch(batch);

    return json({ success: true });
  }

  if (path === "/api/admin/named-playlists" && request.method === "PUT") {
  if (!(await verifyAuth(request, env.DB)))
    return json({ error: "Unauthorized" }, 401);

  try {
    const body = await request.json<{ type: string; playlists: { name: string; url: string }[] }>();

    console.log("Body received:", JSON.stringify(body));

    await env.DB.prepare("DELETE FROM playlists WHERE type = ?")
      .bind(body.type)
      .run();

    console.log("Deleted old rows");

    const stmt = env.DB.prepare(
      "INSERT INTO playlists (url, type, sort_order, name) VALUES (?, ?, ?, ?)"
    );

    const batch = body.playlists.map((p, i) =>
      stmt.bind(p.url, body.type, i + 1, p.name)
    );

    console.log("Batch size:", batch.length);

    if (batch.length) await env.DB.batch(batch);

    return json({ success: true });
  } catch (err: any) {
    console.error("Error in named-playlists PUT:", err);
    return json({ error: err.message || String(err) }, 500);
  }
                 }

  // ================= CORS PROXY =================

  if (path === "/api/cors-proxy" && request.method === "GET") {
    const target = url.searchParams.get("url") || "";
    if (!target) return new Response("Missing url parameter", { status: 400 });

    try {
      const upstream = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Referer": new URL(target).origin,
          "Accept": "*/*",
        },
      });

      if (!upstream.ok) {
        return new Response(`Upstream error: ${upstream.status}`, { status: upstream.status });
      }

      const contentType = upstream.headers.get("content-type") || "";
      const baseUrl = target.substring(0, target.lastIndexOf("/") + 1);
      const proxyBase = `/api/cors-proxy?url=`;

      // Rewrite .m3u8 playlists
      if (contentType.includes("m3u") || target.includes(".m3u8")) {
        let text = await upstream.text();
        text = text.replace(/^([^#\n\s][^\n]*)$/gm, (line) => {
          const trimmed = line.trim();
          if (!trimmed) return line;
          const resolved = trimmed.startsWith("http")
            ? trimmed
            : new URL(trimmed, baseUrl).toString();
          return proxyBase + encodeURIComponent(resolved);
        });
        return new Response(text, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/vnd.apple.mpegurl",
          },
        });
      }

      // Proxy segments / other files
      const buffer = await upstream.arrayBuffer();
      return new Response(buffer, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch (e: any) {
      return new Response(`Proxy error: ${e.message}`, { status: 502 });
    }
  }

  // ================= CONTACT =================

  if (path === "/api/contact" && request.method === "POST") {
    try {
      const body = await request.json<{ name: string; email: string; message: string }>();

      if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
        return json({ error: "All fields are required" }, 400);
      }

      await env.DB.prepare(
        "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)"
      ).bind(body.name.trim(), body.email.trim(), body.message.trim()).run();

      console.log(`Contact message from ${body.name} <${body.email}>`);

      return json({ success: true, message: "Message received. We'll get back to you soon." });
    } catch (err: any) {
      console.error("Error in contact POST:", err);
      return json({ error: err.message || "Failed to save message" }, 500);
    }
  }

  return json({ error: "Not found" }, 404);
};
