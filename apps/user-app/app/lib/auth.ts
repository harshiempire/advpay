import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  number: string | undefined;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password" },
      },
      // TODO: User credentials type from next-auth✅
      async authorize(
        credentials: Record<"phone" | "password", string> | undefined
      ): Promise<User | null> {
        // Do zod validation, OTP validation here
        if (credentials) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const existingUser = await db.user.findUnique({
            where: {
              number: credentials.phone,
            },
          });

          if (existingUser) {
            const passwordValidation = await bcrypt.compare(
              credentials.password,
              existingUser.password
            );
            if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.email,
                number: existingUser.number,
              };
            }

            return null;
          }

          try {
            const user = await db.user.create({
              data: {
                number: credentials.phone,
                password: hashedPassword,
              },
            });

            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              number: user.number,
            };
          } catch (e) {
            console.error("Error creating user:", e);
          }

          return null;
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};
