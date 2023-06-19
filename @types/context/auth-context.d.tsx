import { Form as RegisterForm } from "../app/screens/auth/register-screen";

export interface AuthContext {
  hasLogged: boolean;
  setHasLogged: (value: boolean) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<any>;
  getToken: (url: string) => Promise<string>;
}

export interface JsonWebTokenDecode {
  exp: number;
}
