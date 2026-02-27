import Lottie from "lottie-react";
import confettiData from "@/assets/animations/success-confetti.json";

export const ConfettiBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Lottie
        animationData={confettiData}
        renderer="svg"
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

