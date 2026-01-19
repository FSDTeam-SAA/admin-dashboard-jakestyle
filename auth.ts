import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5006";

type LoginPayload = {
  accessToken: string;
  refreshToken: string;
  role?: string;
  _id?: string;
  user?: any;
  email?: string;
  name?: string;
};

const decodeJwt = (token?: string) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base + "=".repeat((4 - (base.length % 4)) % 4);
  const payload =
    typeof globalThis.atob === "function"
      ? globalThis.atob(padded)
      : typeof Buffer !== "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : "";
  try {
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
};

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const response = await fetch(`${apiBase}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
      credentials: "include",
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body?.message || "Unable to refresh token");
    }

    const data = body?.data as LoginPayload;
    const decoded = decodeJwt(data?.accessToken);

    return {
      ...token,
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken || token.refreshToken,
      accessTokenExpires: decoded?.exp ? decoded.exp * 1000 : undefined,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/auth/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${apiBase}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            credentials: "include",
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result?.message || "Unable to login");
          }

          const payload = result?.data as LoginPayload;
          if (!payload?.accessToken || !payload?.refreshToken) {
            throw new Error(result?.message || "Invalid login response");
          }

          return {
            id: payload._id || payload.user?._id,
            name: payload.user?.name || payload.name,
            email: payload.user?.email || payload.email || credentials.email,
            role: payload.role || payload.user?.role,
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            user: payload.user || payload,
          };
        } catch (error: any) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Unable to login";
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const decoded = decodeJwt((user as any).accessToken);
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = decoded?.exp
          ? decoded.exp * 1000
          : undefined;
        token.user =
          (user as any).user || {
            id: (user as any).id,
            email: (user as any).email,
            name: (user as any).name,
            role: (user as any).role,
          };
        token.role = (user as any).role || (token.user as any)?.role;
        return token;
      }

      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number) - 60_000
      ) {
        return token;
      }

      if (!token.refreshToken) return token;
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id:
          (token.user as any)?._id ||
          (token.user as any)?.id ||
          token.sub ||
          "",
        email: (token.user as any)?.email || session.user?.email || "",
        name: (token.user as any)?.name || session.user?.name || "",
        role: token.role || (token.user as any)?.role,
      } as any;
      (session as any).accessToken = token.accessToken as string | undefined;
      (session as any).refreshToken = token.refreshToken as string | undefined;
      (session as any).rawUser = token.user as any;
      (session as any).error = token.error as string | undefined;
      return session;
    },
  },
  trustHost: true,
});
