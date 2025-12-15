import { proxy } from 'valtio';
import { cookieUtils } from '@/utils/cookie';
import $axios from '@/_api/axios';
import type { AxiosError } from 'axios';

export type TUserRole = 'admin' | 'manager' | 'member';

export interface TAuthUser {
  _id: string;
  name?: string;
  email: string;
  role: TUserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
}

const authStore = proxy({
  user: null as TAuthUser | null,
  isAuthenticated: false,

  loginRequest: 0,
  reAuthorizeRequest: 0,
  signupRequest: 0,

  authenticationLoading: false,
  authenticationError: null as string | null,
  loginError: null as string | null,
  signupError: null as string | null,

  async login(
    payload: LoginPayload,
  ): Promise<[TAuthUser | null, string | null]> {
    this.loginError = null;
    this.authenticationError = null;
    this.authenticationLoading = true;

    try {
      const res = await $axios.post<{
        data?: { accessToken?: string };
        accessToken?: string;
      }>('/auth/login', payload);

      const responseData = res.data?.data || res.data;
      const accessToken = responseData?.accessToken;

      if (!accessToken) {
        throw new Error('Token not found');
      }

      cookieUtils.setToken(accessToken);

      const [me, err] = await this.reAuthorizeWithToken();
      if (err) throw new Error(err);

      return [me, null];
    } catch (e: unknown) {
      const err = e as AxiosError<{ message?: string }>;

      this.user = null;
      this.isAuthenticated = false;

      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed';

      this.loginError = message;
      return [null, message];
    } finally {
      this.loginRequest += 1;
      this.authenticationLoading = false;
    }
  },

  async signup(
    payload: SignupPayload,
  ): Promise<[boolean, string | null]> {
    this.signupError = null;
    this.authenticationLoading = true;

    try {
      await $axios.post('/users/register', payload);
      return [true, null];
    } catch (e: unknown) {
      const err = e as AxiosError<{ message?: string }>;

      const message =
        err.response?.data?.message ||
        err.message ||
        'Signup failed';

      this.signupError = message;
      return [false, message];
    } finally {
      this.signupRequest += 1;
      this.authenticationLoading = false;
    }
  },

  async reAuthorizeWithToken(): Promise<
    [TAuthUser | null, string | null]
  > {
    let resp: [TAuthUser | null, string | null] = [
      null,
      null,
    ];
    this.authenticationError = null;

    try {
      const res = await $axios.get<{
        data?: TAuthUser;
      }>('/users/me');

      const data = res.data?.data;

      if (!data) {
        throw new Error('Unauthorized');
      }

      this.user = data;
      this.isAuthenticated = true;
      resp = [data, null];
    } catch (e: unknown) {
      const err = e as AxiosError<{ message?: string }>;

      this.user = null;
      this.isAuthenticated = false;

      const message =
        err.response?.data?.message ||
        err.message ||
        'Permission denied';

      this.authenticationError = message;
      resp = [null, message];
    } finally {
      this.reAuthorizeRequest += 1;
      return resp;
    }
  },

  logout(): void {
    this.user = null;
    this.isAuthenticated = false;
    this.authenticationError = null;
    this.loginError = null;
    this.signupError = null;

    cookieUtils.removeToken();
  },

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  },

  isManager(): boolean {
    return this.user?.role === 'manager';
  },

  isMember(): boolean {
    return this.user?.role === 'member';
  },
});

export default authStore;
