import { Env, Config } from './types';
import { handleCORS, handleUpload, handleDownload } from './handlers';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const config: Config = {
      corsHeaders: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
        "Access-Control-Max-Age": "86400"
      },
      rootCdnUrl: env.ROOT_CDN_URL || "https://cdn.example.com"
    };

    if (request.method === "OPTIONS") {
      return handleCORS(request, config.corsHeaders);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.startsWith("/download")) {
      return handleDownload(request, config);
    }

    return handleUpload(request, env, config);
  }
};