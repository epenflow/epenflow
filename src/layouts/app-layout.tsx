import type React from "react";
import AppHeader from "./app/app-header";

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
};
export default AppLayout;
