import { Env, Config } from '../types';

export async function handleUpload(request: Request, env: Env, config: Config): Promise<Response> {
  const url = new URL(request.url);
  const uploadType = url.searchParams.get("type");

  if (uploadType === "external") {
    return handleExternalUpload(request, env, config);
  } else if (uploadType === "direct") {
    return handleDirectUpload(request, env, config);
  } else {
    return new Response("Invalid upload type", { status: 400 });
  }
}

async function handleExternalUpload(request: Request, env: Env, config: Config): Promise<Response> {
  const url = new URL(request.url);
  const externalUrl = url.searchParams.get("url");
  
  if (!externalUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const fileKey = formData.get("fileKey") as string;

    if (!fileKey) {
      return new Response("Missing fileKey parameter", { status: 400 });
    }

    const mediaResponse = await fetch(externalUrl);
    
    if (!mediaResponse.ok) {
      return new Response(`Failed to fetch file: ${mediaResponse.statusText}`, { status: mediaResponse.status });
    }

    const contentType = mediaResponse.headers.get("content-type") || "application/octet-stream";
    const mediaArrayBuffer = await mediaResponse.arrayBuffer();

    const fileResponse = await env.BUCKET.get(fileKey);
    if (fileResponse) {
      const cdnUrl = `${config.rootCdnUrl}/${fileKey}`;
      return new Response(JSON.stringify({ message: "file already exists!", fileKey, cdnUrl }), {
        headers: {
          ...config.corsHeaders,
          "Content-Type": "application/json"
        }
      });
    } else {
      await env.BUCKET.put(fileKey, mediaArrayBuffer, {
        httpMetadata: { contentType }
      });
      const cdnUrl = `${config.rootCdnUrl}/${fileKey}`;
      return new Response(JSON.stringify({ message: "success!", cdnUrl, contentType }), {
        headers: {
          ...config.corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.error("Error processing external upload:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function handleDirectUpload(request: Request, env: Env, config: Config): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileKey = formData.get("fileKey") as string;

    if (!file || !fileKey) {
      return new Response("Missing file or fileKey", { status: 400 });
    }

    const contentType = file.type || "application/octet-stream";
    const arrayBuffer = await file.arrayBuffer();

    const fileResponse = await env.BUCKET.get(fileKey);
    if (fileResponse) {
      const cdnUrl = `${config.rootCdnUrl}/${fileKey}`;
      return new Response(JSON.stringify({ message: "file already exists!", fileKey, cdnUrl }), {
        headers: {
          ...config.corsHeaders,
          "Content-Type": "application/json"
        }
      });
    } else {
      await env.BUCKET.put(fileKey, arrayBuffer, {
        httpMetadata: { contentType }
      });
      const cdnUrl = `${config.rootCdnUrl}/${fileKey}`;
      return new Response(JSON.stringify({ message: "success!", cdnUrl, contentType }), {
        headers: {
          ...config.corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.error("Error processing direct upload:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}