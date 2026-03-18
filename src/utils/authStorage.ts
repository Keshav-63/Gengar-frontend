const ACCESS_TOKEN_KEYS = ['access_token', 'accessToken', 'token', 'jwt'] as const;
const REFRESH_TOKEN_KEYS = ['refresh_token', 'refreshToken'] as const;

const getFirstTokenByKeys = (keys: readonly string[]) => {
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) {
      return value;
    }
  }
  return null;
};

export const getStoredAccessToken = () => getFirstTokenByKeys(ACCESS_TOKEN_KEYS);

export const getStoredRefreshToken = () => getFirstTokenByKeys(REFRESH_TOKEN_KEYS);

export const setStoredAccessToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

export const setStoredRefreshToken = (token: string) => {
  localStorage.setItem('refresh_token', token);
};

export const clearStoredAuth = () => {
  for (const key of ACCESS_TOKEN_KEYS) {
    localStorage.removeItem(key);
  }

  for (const key of REFRESH_TOKEN_KEYS) {
    localStorage.removeItem(key);
  }
};