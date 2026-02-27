'use client';

import React, { memo, useMemo, useEffect } from 'react';
import { Sponsor } from '@/shared/types';
import {
  SLOT_CARD_HEIGHT,
  SLOT_VISIBLE_CARDS,
  MACHINE_WIDTH,
} from '@/shared/lib/game-config';
import { GAME_RULES } from '@/shared/lib/game-config';

interface SlotMachineContentProps {
  spinRefs: React.RefObject<HTMLDivElement | null>[];
  sponsors: Sponsor[];
}

const SLOT_INDICES = [0, 1, 2] as const;

function usePreloadImages(sponsors: Sponsor[]) {
  useEffect(() => {
    sponsors.forEach((sponsor) => {
      const img = new Image();
      img.src = sponsor.logo;
    });
  }, [sponsors]);
}

const SlotCard = memo(function SlotCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-2"
      style={{
        height: `${SLOT_CARD_HEIGHT}px`,
      }}
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        loading="eager"
        // async: browser decodes off main thread, avoiding frame drops
        decoding="async"
        className="object-contain"
        style={{ maxHeight: '26px', maxWidth: '60%' }}
      />
      {sponsor.text && (
        <p
          className="text-[#111D21] text-center line-clamp-2 text-xs mt-0.5"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {sponsor.text}
        </p>
      )}
      <div
        className="w-10 h-px mt-1"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, #B5B5B5 20%, #B5B5B5 80%, transparent 100%)',
        }}
      />
    </div>
  );
});

function SlotMachineContentInner({ spinRefs, sponsors }: SlotMachineContentProps) {
  usePreloadImages(sponsors);

  const minCards = useMemo(
    // +5 extra rotations on top of MIN_FULL_ROTATIONS:
    // accounts for MAX_EXTRA_SPINS(2) + SCROLL_MIN_ROTATIONS(2) + safety buffer(1)
    () => (GAME_RULES.MIN_FULL_ROTATIONS + 5) * sponsors.length,
    [sponsors.length]
  );

  const slotHeight = SLOT_CARD_HEIGHT * SLOT_VISIBLE_CARDS;

  return (
    // Outer wrapper: position context only, no overflow clipping, no border.
    // Border lives in a separate absolute overlay so it never clips children.
    <div
      className="relative w-full mx-auto mb-1"
      style={{ maxWidth: MACHINE_WIDTH }}
    >
      {/* Animation container: clip-path ONLY for content clipping.
          No border here — border+clip-path on the same element causes Safari
          to render the border before clipping, producing visible gaps. */}
      <div
        className="relative grid grid-cols-3 gap-0 w-full"
        style={{
          clipPath: 'inset(0 round 56px)',
          WebkitClipPath: 'inset(0 round 56px)',
        }}
      >
        {SLOT_INDICES.map((slotIndex) => (
          // Column clipping container: clip-path only, no GPU hints.
          // GPU hints (backface-visibility, translate3d) on a non-animated
          // container create extra compositor layers with no benefit and can
          // prevent iOS from properly compositing the animated child.
          <div
            key={slotIndex}
            className="relative w-full"
            style={{
              height: `${slotHeight}px`,
              backgroundColor: '#FFEDD9',
              clipPath: 'inset(0)',
              WebkitClipPath: 'inset(0)',
            }}
          >
            {/* Animated strip: GPU hints live here — only on the element
                that actually moves. willChange is set dynamically by the hook
                (in its mount useEffect) so iOS pre-rasterises before autoStart. */}
            <div
              ref={spinRefs[slotIndex]}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: 'translate3d(0,0,0)',
                WebkitTransform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {Array.from({ length: minCards }, (_, index) => (
                <SlotCard
                  key={`${slotIndex}-${index}`}
                  sponsor={sponsors[index % sponsors.length]}
                />
              ))}
            </div>
          </div>
        ))}

        <svg
          className="absolute top-0 pointer-events-none z-10"
          style={{
            left: 'calc(100% / 3)',
            transform: 'translateX(-50%)',
            height: `${slotHeight}px`,
            width: 18,
          }}
          viewBox="0 0 18 215"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M16.5 0.791275C-3.94631 33.7188 -3.04865 178.394 16.5 213.791"
            stroke="#FFA2DC"
            strokeWidth="3"
          />
        </svg>

        <svg
          className="absolute top-0 pointer-events-none z-10"
          style={{
            left: 'calc(200% / 3)',
            transform: 'translateX(-50%)',
            height: `${slotHeight}px`,
            width: 18,
          }}
          viewBox="0 0 18 215"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M1.31305 0.791275C21.7594 33.7188 20.8617 178.394 1.31306 213.791"
            stroke="#FFA2DC"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Visual border + shadow frame: absolutely positioned ABOVE the content.
          Separate element = no overflow clipping on animated children.
          No GPU hints (translateZ / backfaceVisibility) — this is a static
          element; promoting it to a compositor layer makes iOS render inset
          box-shadow relative to the GPU layer bounds instead of the element
          bounds, which causes the "shadow spread" artifact.
          -inset-px extends border beyond content to fully cover background gaps. */}
      <div
        className="absolute -inset-px pointer-events-none z-20 rounded-[57px] border-4 border-[#FF8B00]"
        style={{
          boxShadow:
            'inset 0 6px 16px rgba(0,0,0,0.12), inset 0 -2px 8px rgba(0,0,0,0.04), inset 4px 0 12px rgba(0,0,0,0.06), inset -4px 0 12px rgba(0,0,0,0.06), inset 0 0 20px 8px rgba(255,162,220,0.3)',
        }}
        aria-hidden
      />
    </div>
  );
}

export const SlotMachineContent = memo(SlotMachineContentInner);
