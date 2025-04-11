import ClientLayout from "@/src/components/layout/explorerLayout";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  
    return (
      <ClientLayout>{children}</ClientLayout>
    );
  };
  
  export default Layout;
  