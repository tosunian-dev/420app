import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import AdminModel from "@/app/models/admin";

export interface IAdminSession {
  name: string;
  surname: string;
  username: string;
  uuid: string;
  role: "ADMIN" | "EMPLOYEE";
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        /*const user = {
          id: "66b0fc775404edd759c00859",
          username: "leatosunian",
          role: "ADMIN",
          uuid: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
          name: "Leandro",
          surname: "Tosunian",
        };*/
        try {
          await connectDB();
          const userExists = await AdminModel.findOne({
            username: credentials?.username,
          }).select("+password");
          if (!userExists) {
            throw new Error("USER_NOT_FOUND");
          }
          if (credentials?.password !== userExists.password) {
            throw new Error("WRONG_PASSWORD");
          }
          return userExists;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    session({ session, token }) {
      session.user = token.user as IAdminSession;
      //console.log(session, token);
      return session;
    },
  },
  pages: {
    signIn: '/admin/login'
  }
});

export { handler as GET, handler as POST };
