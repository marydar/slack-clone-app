"use client";
import { UserButton } from "@/features/auth/components/user-button";
import { useAuthActions } from "@convex-dev/auth/react";
export default function Home() {
  const {signOut} = useAuthActions();
  return (
    <div>
      logged in
      <UserButton/>
      {/* <Button onClick={() => signOut()}>
        signout
      </Button> */}
    </div>
  )
}
