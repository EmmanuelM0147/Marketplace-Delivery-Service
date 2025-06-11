import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const authConfig = {
  providers: ["email"],
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  }
};

export const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
};

export async function getServerUser() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session }, error } = await supabase.auth.getSession();
  return session?.user;
}