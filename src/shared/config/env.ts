const configured = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
export const API_URL =
  configured !== undefined && configured !== ''
    ? configured
    : import.meta.env.DEV
      ? ''
      : 'http://localhost:4000';

export const API_V1 = `${API_URL}/api/v1`;
export const UPLOADS_URL = `${API_URL}/uploads`;
