function normalizeUrl(url) {
  return url ? url.replace(/\/+$/, '') : url;
}

export const API_BASE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
);

export const SITE_BASE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
);

export const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL
  ? normalizeUrl(process.env.NEXT_PUBLIC_CONTACT_API_URL)
  : '';
