import { Sponsor } from "@/shared";
import { useState, useRef, useCallback, useEffect } from "react";

const SPIN_DURATION = 7000;
const RESULT_DISPLAY_DURATION = 1500;
const MIN_COPIES = 15;

interface UseSlotMachineProps {
    sponsors: Sponsor[];
    onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
}

export function useSlotMachine({ sponsors, onComplete }: UseSlotMachineProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [completedSlots, setCompletedSlots] = useState<Set<number>>(new Set());

    const spinResultRef = useRef<{ winner: Sponsor | null; isWin: boolean } | null>(null);
    const spinRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];

    const getCardHeight = useCallback(() => {
        if (typeof window === "undefined") return 248;
        const width = window.innerWidth;
        if (width >= 1280) return 248;
        if (width >= 1024) return 220;
        if (width >= 768) return 198;
        if (width >= 640) return 176;
        return 154;
    }, []);

    const handleSlotComplete = useCallback((slotIndex: number) => {
        setCompletedSlots((prev) => {
            const newSet = new Set(prev);
            newSet.add(slotIndex);

            if (newSet.size === 3) {
                setIsComplete(true);

                setTimeout(() => {
                    if (onComplete && spinResultRef.current) {
                        onComplete(spinResultRef.current);
                    }
                }, RESULT_DISPLAY_DURATION);
            }

            return newSet;
        });
    }, [onComplete]);

    const startSpin = useCallback(() => {
        if (isSpinning || sponsors.length === 0) return;

        setIsSpinning(true);
        setIsComplete(false);
        setIsWin(false);
        setCompletedSlots(new Set());
        spinResultRef.current = null;

        // Reset slots
        spinRefs.forEach((slotRef) => {
            if (slotRef.current) {
                slotRef.current.style.transition = "none";
                slotRef.current.style.transform = "translateY(0)";
            }
        });

        void document.body.offsetHeight;

        // Determine win/lose
        const winResult = Math.random() < 0.5;
        setIsWin(winResult);

        let winners: [number, number, number];
        let winningSponsorIndex: number;

        if (winResult) {
            winningSponsorIndex = Math.floor(Math.random() * sponsors.length);
            winners = [winningSponsorIndex, winningSponsorIndex, winningSponsorIndex];
        } else {
            const selected: number[] = [];
            const availableIndices = Array.from({ length: sponsors.length }, (_, i) => i);

            while (selected.length < 3) {
                const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                if (!selected.includes(randomIndex)) {
                    selected.push(randomIndex);
                }
            }

            winners = [selected[0], selected[1], selected[2]] as [number, number, number];
            winningSponsorIndex = -1;
        }

        spinResultRef.current = {
            winner: winResult ? sponsors[winningSponsorIndex] : null,
            isWin: winResult,
        };

        const CARD_HEIGHT = getCardHeight();

        // Animate slots
        spinRefs.forEach((slotRef, index) => {
            if (slotRef.current) {
                const targetIndex = winners[index];
                const minFullRotations = 7;
                const totalSpins = minFullRotations * sponsors.length + targetIndex;
                const targetPosition = -(totalSpins * CARD_HEIGHT);

                const currentSlot = slotRef.current;
                const handleTransitionEnd = (e: TransitionEvent) => {
                    if (e.propertyName === "transform") {
                        handleSlotComplete(index);
                        currentSlot.removeEventListener("transitionend", handleTransitionEnd);
                    }
                };

                setTimeout(() => {
                    if (slotRef.current) {
                        slotRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0.35, 0.25, 0.85)`;
                        slotRef.current.style.transform = `translateY(${targetPosition}px)`;
                        slotRef.current.addEventListener("transitionend", handleTransitionEnd);
                    }
                }, 10);
            }
        });

        setTimeout(() => {
            setIsSpinning(false);
        }, SPIN_DURATION);
    }, [isSpinning, sponsors, handleSlotComplete, getCardHeight]);

    // Cleanup
    useEffect(() => {
        return () => {
            spinRefs.forEach((slotRef) => {
                if (slotRef.current) {
                    const clone = slotRef.current.cloneNode(true);
                    if (slotRef.current.parentNode) {
                        slotRef.current.parentNode.replaceChild(clone, slotRef.current);
                    }
                }
            });
        };
    }, []);

    // Auto-start
    useEffect(() => {
        const timer = setTimeout(startSpin, 500);
        return () => clearTimeout(timer);
    }, []);

    const extendedSponsors = Array(MIN_COPIES).fill(sponsors).flat();

    return {
        isSpinning,
        isComplete,
        isWin,
        spinRefs,
        extendedSponsors,
        startSpin,
    };
}