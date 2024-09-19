import { Config } from '../types';

export async function handleDownload(request: Request, config: Config): Promise<Response> {
  const url = new URL(request.url);
  const externalUrl = url.searchParams.get("url");

  if (!externalUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const externalResponse = await fetch(externalUrl);
    if (!externalResponse.ok) {
      return new Response(`Failed to fetch file: ${externalResponse.statusText}`, { status: externalResponse.status });
    }

    const contentType = externalResponse.headers.get("content-type") || "application/octet-stream";
    const headers = new Headers(config.corsHeaders);
    headers.set("Content-Type", contentType);

    if (!externalResponse.body) {
      return new Response("No content available to download", { status: 204 });
    }

    const reader = externalResponse.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      }
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error("Error fetching external file:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}