import { forwardRef, HTMLAttributes, ReactNode } from "react";

const SnapParent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div {...props} ref={ref} className="h-screen w-full snap-y snap-mandatory overflow-y-scroll">
      {children}
    </div>
  ),
);
SnapParent.displayName = "SnapParent";

export const CastWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full">
      <SnapParent className="absolute w-full">{children}</SnapParent>
    </div>
  );
};
