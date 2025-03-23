import { Loader2 } from "lucide-react";
import type React from "react";

const RoutePending: React.FC = () => {
  return (
    <div className="min-h-dvh w-full fixed top-0 left-1/2 -translate-x-1/2 flex items-center justify-center bg-card z-[99999]">
      <Loader2 size={50} className="animate-spin text-foreground/80" />
    </div>
  );
};

export default RoutePending;
