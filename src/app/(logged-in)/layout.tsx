import { ReactNode } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <>
      {children}
      <div className="fixed inset-x-0 bottom-0 px-6 py-4 backdrop-blur-xl">bottom</div>
    </>
  );
};

export default Layout;
