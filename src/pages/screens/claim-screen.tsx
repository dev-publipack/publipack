'use client';

import { useRef, useState, useCallback } from "react";
import { MachineContainer } from "@/components/machine-container";
import { ClaimForm } from "@/components/claim-form";
import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";
import type { ClaimSubmitData } from "@/components/claim-form";
import type { Sponsor } from "@/shared/types";

interface ClaimScreenProps {
  winner: Sponsor;
  onSubmit: (data: ClaimSubmitData) => void;
  onBack?: () => void;
}

export function ClaimScreen({ winner, onSubmit, onBack }: ClaimScreenProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChainBlockClick = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  return (
    <ScreenLayout topChainText="! WINNER !" showActivityNotifications>
      <div className="relative w-full max-w-[480px] flex flex-col items-center pt-1 pb-10 ">
        <MachineContainer variant="form">
          <MainContentContainerWrapper
            showChainBlock
            chainBlockText="Claim Now"
            headerText="! WINNER !"
            lanternState="winner"
            onChainBlockClick={handleChainBlockClick}
            chainBlockDisabled={isSubmitting}
          >
            <div className="flex flex-col items-center w-full min-h-0 px-4  mb-4 sm:px-6">
              <div className="flex flex-col items-center w-full max-w-[280px] min-w-0 overflow-hidden">
                <img
                  src={winner.logo}
                  alt={winner.name}
                  className="h-11 sm:h-12 max-h-12 max-w-full object-contain object-center mb-2"
                />
                <p className="text-center font-roboto font-black text-[20px] sm:text-[24px] leading-tight uppercase text-[#000000] shrink-0">
                  {winner.reward || "a prize"}
                </p>
              </div>

              <ClaimForm
                onSubmit={onSubmit}
                formRef={formRef}
                onSubmittingChange={setIsSubmitting}
              />
            </div>
          </MainContentContainerWrapper>
        </MachineContainer>
      </div>
    </ScreenLayout>
  );
}
