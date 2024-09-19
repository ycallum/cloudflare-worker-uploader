import { R2Bucket } from '@cloudflare/workers-types';

export interface Env {
  BUCKET: R2Bucket;
  ROOT_CDN_URL?: string;
}

export interface Config {
  corsHeaders: {
    [key: string]: string;
  };
  rootCdnUrl: string;
}