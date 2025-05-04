import { serve } from "https://deno.land/std@0.223.0/http/server.ts";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const API_KEY = Deno.env.get("GROK_API_KEY"); // 通过环境变量获取密钥

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path !== "/v1/chat/completions") {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${API_KEY}`);
    headers.set("Content-Type", "application/json");

    const proxyReq = new Request(GROK_API_URL, {
      method: req.method,
      headers,
      body: req.body,
    });

    const response = await fetch(proxyReq);

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
