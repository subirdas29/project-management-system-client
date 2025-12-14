import Cookies from 'js-cookie';

const COOKIE_NAME = 'token'; 
const COOKIE_EXPIRY = 1;  

export const cookieUtils = {
  setToken(token: string): void {
    Cookies.set(COOKIE_NAME, token, {
      expires: COOKIE_EXPIRY,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  },

  getToken(): string | undefined {
    return Cookies.get(COOKIE_NAME);
  },

  removeToken(): void {
    Cookies.remove(COOKIE_NAME);
  },
};
