import { getServerSession } from "@/lib/auth/session";

import { NavbarClient } from "@/components/site/navbar-client";

export async function Navbar() {
  const session = await getServerSession();

  return (
    <NavbarClient
      session={
        session
          ? {
              username: session.username,
              isAdmin: session.isAdmin,
              activeRole: session.activeRole,
              roles: session.roles,
            }
          : null
      }
    />
  );
}
