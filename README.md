# Cloudflare Worker Media Uploader

This Cloudflare Worker serves as a proxy for uploading and downloading media files. It can fetch media from external URLs, store them in Cloudflare R2, and serve them through a CDN.

## Features

- CORS support
- Upload media from external URLs to R2
- Download media from external URLs
- Automatic content type detection

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `wrangler.toml.example` to `wrangler.toml`
4. Update `wrangler.toml` with your R2 bucket name and desired CDN URL
5. Deploy to Cloudflare Workers: `npm run deploy`

## Configuration

In your `wrangler.toml` file:

1. Set `name` to your desired Worker name
2. Update `ROOT_CDN_URL` to your CDN URL
3. Replace `your-bucket-name` with your R2 bucket name

## Usage

### Upload

#### External URL Upload
POST to `/upload?type=external` with the following parameters:
- `url`: External URL of the file to upload (query parameter)
- `fileKey`: Unique identifier for the file (form data)

#### Direct File Upload
POST to `/upload?type=direct` with the following parameters:
- `file`: The file to upload (form data)
- `fileKey`: Unique identifier for the file (form data)

Content-Type should be `multipart/form-data` for direct file uploads.

## Environment Variables

- `ROOT_CDN_URL`: The base URL of your CDN (default: https://cdn.example.com)

## Development
- Deploy: `npm run deploy`