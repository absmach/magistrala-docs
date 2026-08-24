"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/user-guide/users-quick-start");
  }, [router]);
  return null;
}
