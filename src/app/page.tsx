"use client";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setIsLoading(true);
        const data = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include",
        });
        if (!data.ok) {
          router.push("/login");
        }
        const user = await data.json();
        setUser(user);
        setIsLoading(false);
      } catch (error) {
        router.push("/login");
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

  const logout = async () => {
    setIsLoading(true);
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    router.push("/login");
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <div>
      <div>{user && <Button onClick={logout}>Logout</Button>}</div>
      <div>{user.firstName}</div>
      <div>{user.lastName}</div>
      {/* <LoadingSpinner size={60} /> */}
    </div>
  );
}
