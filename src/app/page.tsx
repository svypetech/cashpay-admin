"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/signin");
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
      } else {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const role = decodedToken.role;
        if (role === "super admin") {
          router.push("/dashboard");
        } else {
          router.push("/settings");
        }
      }
    }
  }, []);

  return (
    <div className=" flex flex-col items-between justify-between h-screen">

    </div>
  );
}
