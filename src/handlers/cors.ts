export function handleCORS(request: Request, corsHeaders: { [key: string]: string }): Response {
  return new Response(null, {
    headers: {
      ...corsHeaders,
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || ""
    }
  });
}