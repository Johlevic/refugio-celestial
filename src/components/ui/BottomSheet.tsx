import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  bodyBackgroundImageUrl?: string;
  maxHeightClassName?: string;
  zIndexClassName?: string;
  panelClassName?: string;
};

/**
 * Reusable responsive sheet:
 * - Mobile: bottom sheet.
 * - md+: centered modal.
 * Header is always centered, footer is optional.
 */
export function BottomSheet({
  isOpen,
  title,
  onClose,
  children,
  footer,
  closeLabel = "Close",
  bodyBackgroundImageUrl,
  maxHeightClassName = "max-h-[80dvh] md:max-h-[82vh]",
  zIndexClassName = "z-[95]",
  panelClassName = "md:max-w-xl",
}: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    // Keep body scroll on desktop to avoid layout jump.
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndexClassName} flex items-end justify-center bg-[#04060f]/84 px-0 backdrop-blur-[2px] md:items-center md:px-4`}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full min-h-0 flex-col rounded-t-2xl border border-gold-400/55 border-b-0 bg-[#0b1024] text-gold-100 shadow-[0_24px_64px_rgba(0,0,0,0.72)] md:max-w-md md:rounded-2xl md:border ${maxHeightClassName} ${panelClassName}`.trim()}
      >
        <div className="flex justify-center pt-2 md:hidden">
          <span className="h-1 w-12 rounded-full bg-gold-200/45" aria-hidden />
        </div>

        <header className="flex items-center justify-between border-b border-gold-500/35 px-4 pb-2 pt-3 md:pb-3 md:pt-4">
          <h3 className="w-full text-center font-display text-sm font-semibold uppercase tracking-[0.12em] text-gold-200">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-500/45 text-gold-100 transition hover:border-gold-300 hover:bg-gold-500/15"
          >
            <i className="fa-solid fa-xmark" aria-hidden />
          </button>
        </header>

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-4 md:min-h-[46vh] md:py-5"
          style={
            bodyBackgroundImageUrl
              ? {
                  backgroundImage: `url("${bodyBackgroundImageUrl}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {bodyBackgroundImageUrl ? (
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#04070f]/74 via-[#050a14]/82 to-[#04070f]/76 md:from-[#04070f]/70 md:via-[#050a14]/80 md:to-[#04070f]/72"
              aria-hidden
            />
          ) : null}
          <div
            className={`relative z-[1] ${
              bodyBackgroundImageUrl
                ? "flex w-full max-w-2xl items-center justify-center rounded-xl border border-gold-400/45 bg-[#030712]/90 p-5 text-center text-[#f4c95d] [text-shadow:0_1px_3px_rgba(0,0,0,0.95)] md:p-7"
                : ""
            }`.trim()}
          >
            {children}
          </div>
        </div>

        {footer ? <footer className="border-t border-gold-500/35 px-4 py-2 md:py-4">{footer}</footer> : null}
      </section>
    </div>,
    document.body
  );
}
