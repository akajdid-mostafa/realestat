function normalizeUrl(url) {
  return url ? url.replace(/\/+$/, '') : url;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is required: the public app must target the dashboard backend origin. ' +
      'Refusing to fall back to the legacy backend.'
  );
}

export const API_BASE_URL = normalizeUrl(apiUrl);

export const SITE_BASE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
);

export const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL
  ? normalizeUrl(process.env.NEXT_PUBLIC_CONTACT_API_URL)
  : '';
