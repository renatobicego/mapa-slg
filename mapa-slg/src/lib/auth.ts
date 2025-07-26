import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const response = await axios.post(
            `${process.env.BACKEND_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = response.data;

          if (data.success && data.user) {
            return {
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              token: data.token,
              role: data.user.role,
              // add any other fields you want
            };
          }

          return null;
        } catch (err) {
          throw err;
        }
      },
    }),
  ],

  // Optionally persist user info in JWT
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.backendToken = user.token; // Store backend token in JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.backendToken = token.backendToken as string;
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      if (user && account && account.provider === "credentials") {
        account.access_token = user.token as string;
      }
      return true;
    },
  },

  pages: {
    signIn: "/autenticacion/iniciar-sesion",
    newUser: "/autenticacion/registrarse",
    signOut: "/autenticacion/cerrar-sesion",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
