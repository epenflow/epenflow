import { Loader2 } from "lucide-react";
import type React from "react";

const RoutePending: React.FC = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center z-50 fixed top-0 left-1/2 -translate-x-1/2">
      <Loader2 size={50} className="animate-spin text-primary/80" />
    </div>
  );
};

export default RoutePending;
