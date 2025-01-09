"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Refresh({ interval }: { interval: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, interval);
    return () => clearInterval(id);
  }, [router, interval]);
  return null;
}
