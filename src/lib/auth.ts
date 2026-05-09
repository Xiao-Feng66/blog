import { useMock } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

export async function getSession() {
  if (useMock) return null;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function isAdmin() {
  if (useMock || process.env.NODE_ENV === "development") return true;
  const session = await getSession();
  if (!session) return false;
  return session.user.id === ADMIN_USER_ID;
}
