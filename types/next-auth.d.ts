import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    rawUser?: any;
    error?: string;
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      role?: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    user?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    role?: string;
    user?: any;
    error?: string;
  }
}
