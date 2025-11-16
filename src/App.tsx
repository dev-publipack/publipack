import {
  Button,
  RewardCard,
  CountdownTimer,
  SlotMachine,
  YouWon,
  YouLost,
  ClaimReward,
  FailedAnimation,
  SuccessConfettiAnimation,
} from "./shared";
import { useCountdown } from "./hooks/use-countdown";
import { useState, useRef, useEffect } from "react";
import { QueryProvider } from "./providers/query-provider";

const sponsors = [
  {
    name: "Starbucks",
    reward: "Free Drink",
    logo: "/images/starbucks-logo-7815fe.png",
  },
  {
    name: "Domino's",
    reward: "Free Pizza",
    logo: "/images/dominos-logo.png",
  },
  {
    name: "Apple Store",
    reward: "App Store",
    logo: "/images/apple-store-logo-3afa9e.png",
  },
  {
    name: "Disney",
    reward: "Save up %25",
    logo: "/images/disney-logo.png",
  },
  {
    name: "Netflix",
    reward: "Save up %15",
    logo: "/images/netflix-logo-55fe82.png",
  },
  {
    name: "Nike",
    reward: "10% Off",
    logo: "/images/nike-logo.png",
  },
  {
    name: "AMC",
    reward: "Free Movie",
    logo: "/images/amc-logo-60dd13.png",
  },
  {
    name: "Spotify",
    reward: "Free Month",
    logo: "/images/spotify-logo.png",
  },
];

function App() {
  const { seconds, reset } = useCountdown(10);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [showYouWon, setShowYouWon] = useState(false);
  const [showYouLost, setShowYouLost] = useState(false);
  const [showFailedAnimation, setShowFailedAnimation] = useState(false);
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);
  const [showClaimReward, setShowClaimReward] = useState(false);
  const [winner, setWinner] = useState<(typeof sponsors)[0] | null>(null);
  const slotMachineRef = useRef<{ startSpin: () => void }>(null);
  const wasOnOtherScreen = useRef(false);

  // Reset countdown timer when returning to main screen
  useEffect(() => {
    const isOnMainScreen = !showSlotMachine && 
                          !showYouWon && 
                          !showYouLost && 
                          !showFailedAnimation && 
                          !showSuccessConfetti && 
                          !showClaimReward;
    
    // Only reset if we were on another screen before
    if (isOnMainScreen && wasOnOtherScreen.current) {
      reset(10);
      wasOnOtherScreen.current = false;
    } else if (!isOnMainScreen) {
      wasOnOtherScreen.current = true;
    }
  }, [showSlotMachine, showYouWon, showYouLost, showFailedAnimation, showSuccessConfetti, showClaimReward, reset]);

  // Auto-start spin when countdown reaches 0
  useEffect(() => {
    if (seconds === 0 && !showSlotMachine) {
      setShowSlotMachine(true);
      setShowYouWon(false);
      setShowYouLost(false);
      setShowFailedAnimation(false);
      setShowSuccessConfetti(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const handleSpin = () => {
    setShowSlotMachine(true);
    setShowYouWon(false);
    setShowYouLost(false);
    setShowFailedAnimation(false);
    setShowSuccessConfetti(false);
  };

  const handleComplete = (result: {
    winner: (typeof sponsors)[0] | null;
    isWin: boolean;
  }) => {
    if (result.isWin && result.winner) {
      setWinner(result.winner);
      setTimeout(() => {
        setShowSlotMachine(false);
        setShowSuccessConfetti(true);
      }, 200);
    } else {
      setTimeout(() => {
        setShowSlotMachine(false);
        setShowFailedAnimation(true);
      }, 200);
    }
  };

  const handleFailedAnimationComplete = () => {
    setShowFailedAnimation(false);
    setShowYouLost(true);
  };

  const handleSuccessConfettiComplete = () => {
    setShowSuccessConfetti(false);
    setShowYouWon(true);
  };

  const handleReset = () => {
    setShowSlotMachine(false);
    setShowYouWon(false);
    setShowYouLost(false);
    setShowFailedAnimation(false);
    setShowSuccessConfetti(false);
    setWinner(null);
  };

  const handleClaim = () => {
    setShowYouWon(false);
    setShowClaimReward(true);
  };

  const handleClaimSubmit = (data: {
    fullName: string;
    phone: string;
    email: string;
  }) => {
    console.log("Claim data:", data);
    setShowClaimReward(false);
    setWinner(null);
  };

  const handleSpinAgain = () => {
    setShowYouWon(false);
    setShowYouLost(false);
    setShowFailedAnimation(false);
    setShowSuccessConfetti(false);
    setShowSlotMachine(false);
    setShowClaimReward(false);
    setWinner(null);
    // Timer will auto-reset via useEffect when returning to main screen
  };

  const handleBackFromClaim = () => {
    setShowClaimReward(false);
    if (winner) {
      setShowYouWon(true);
    }
  };

  if (showClaimReward && winner) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background: "#F6F8FB",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center">
          <ClaimReward
            winner={winner}
            onSubmit={handleClaimSubmit}
            onBack={handleBackFromClaim}
          />
        </div>
      </main>
    );
  }

  if (showSuccessConfetti) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 12%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <SuccessConfettiAnimation onComplete={handleSuccessConfettiComplete} />
        </div>
      </main>
    );
  }

  if (showYouWon && winner) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 12%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <YouWon
            winner={winner}
            onClaim={handleClaim}
            onSpinAgain={handleSpinAgain}
            brandLink="https://example.com"
          />
        </div>
      </main>
    );
  }

  if (showFailedAnimation) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 19%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <FailedAnimation onComplete={handleFailedAnimationComplete} />
        </div>
      </main>
    );
  }

  if (showYouLost) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 19%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <YouLost onTryAgain={handleSpinAgain} />
        </div>
      </main>
    );
  }

  if (showSlotMachine) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(137deg, rgba(246, 248, 251, 1) 7%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <SlotMachine
            sponsors={sponsors}
            onComplete={handleComplete}
            onReset={handleReset}
            ref={slotMachineRef}
          />
        </div>
      </main>
    );
  }

  return (
    <QueryProvider>
      <main
        className="min-h-screen w-full flex flex-col items-center overflow-x-hidden"
        style={{
          background:
            "linear-gradient(133deg, rgba(246, 248, 251, 1) 0%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] leading-[1.4] text-center mb-3 sm:mb-4">
            READY TO <span className="text-[#44D2FD]">WIN?</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold max-w-[90%] text-[#163446] text-center leading-[1.362] mb-6 sm:mb-8 md:mb-10">
            Spin the wheel and <span className="text-black font-bold">win rewards</span> from our sponsors
          </p>
          
          {/* Sponsor Cards Container */}
          <div
            className="relative w-full bg-white rounded-2xl sm:rounded-3xl md:rounded-[32px] p-4 sm:p-5 md:p-6 lg:p-8 mb-6 sm:mb-8 md:mb-10"
            style={{ boxShadow: "0px 4px 33.10px 0px rgba(0, 0, 0, 0.25)" }}
          >
            {/* Header */}

            {/* Sponsor Cards Grid - 4 columns in a row */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4 max-w-[1000px] w-full mx-auto">
              {sponsors.map((sponsor, index) => (
                <RewardCard
                  key={index}
                  sponsorName={sponsor.name}
                  reward={sponsor.reward}
                  logoUrl={sponsor.logo}
                  logoAlt={`${sponsor.name} logo`}
                  className="w-full"
                />
              ))}
            </div>
          </div>

          {/* Spin Now Button */}
          <Button
            onClick={handleSpin}
            className="w-full max-w-[700px] h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 px-6 mb-4 sm:mb-5 md:mb-6"
            style={{
              background:
                "linear-gradient(90deg, rgba(6, 144, 225, 1) 0%, rgba(56, 207, 253, 1) 100%)",
            }}
            size="lg"
          >
            SPIN NOW
          </Button>

          {/* Countdown Section - moved below button */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 w-full px-2">
            <CountdownTimer seconds={seconds} />
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-body-semibold text-black text-center leading-[1.362]">
              Or wait for the countdown
            </p>
          </div>
        </div>
      </main>
    </QueryProvider>
  );
}

export default App;
