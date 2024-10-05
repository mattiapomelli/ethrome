import { ReactNode } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <>
      {children}
      <div className="fixed inset-x-0 bottom-0">bottom</div>
    </>
  );
};

export default Layout;
