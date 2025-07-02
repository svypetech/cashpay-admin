"use client"
import ClientLayout from "@/src/components/layout/explorerLayout";
import { ToastProvider } from "@/src/lib/ToastProvider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
    const router = useRouter();
    
      useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
          setTimeout(() => {
            setLoading(false);
          }, 500);
          router.push("/signin");
        } else {
          const token = localStorage.getItem("token");
          if (!token) {
            setTimeout(() => {
              setLoading(false);
            }, 500);
            router.push("/signin");
          } else {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const role = decodedToken.role;
            if (role === "super admin") {
              setLoading(false);
            } else {
              setTimeout(() => {
              setLoading(false);
            }, 500);
            router.push("/signin");
              router.push("/signin");
              
            }
          }
        }
      }, []);

      if (loading) { 
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        );
      }

      if (typeof window === "undefined") {
        return null; // Render nothing on the server
      }
  
    return (
      <ToastProvider>
        <ClientLayout>{children}</ClientLayout>
      </ToastProvider>
    );
  };
  
  export default Layout;
  