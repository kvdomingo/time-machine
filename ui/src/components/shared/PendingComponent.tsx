import loading from "@/assets/loading.json";
import Lottie from "lottie-react";

export default function PendingComponent() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie animationData={loading} loop className="h-[256px]" />
    </div>
  );
}
