"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GalleryNewRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/gallery?new=1");
  }, [router]);
  return null;
}
