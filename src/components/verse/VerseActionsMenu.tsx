import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/domain/types";
import {
  captureVerseBlobById,
  downloadVerseCaptureById,
} from "./DownloadButton";
import { showToast } from "@/lib/ui/toast";

type Props = {
  captureElementId: string;
  lang: Lang;
  verseText: string;
  verseRef: string;
  disabled?: boolean;
  className?: string;
};

export function VerseActionsMenu({
  captureElementId,
  lang,
  verseText,
  verseRef,
  disabled,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [hAlign, setHAlign] = useState<"open-left" | "open-right">("open-left");
  const [vAlign, setVAlign] = useState<"up" | "down">("down");

  const t = useMemo(
    () =>
      lang === "es"
        ? {
            actions: "Acciones del versículo",
            share: "Compartir",
            download: "Descargar PNG",
            copy: "Copiar texto",
          }
        : {
            actions: "Verse actions",
            share: "Share",
            download: "Download PNG",
            copy: "Copy text",
          },
    [lang]
  );

  const shareText = `“${verseText}” — ${verseRef}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (ev: MouseEvent) => {
      if (!boxRef.current?.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const anchor = boxRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const ar = anchor.getBoundingClientRect();
    const pr = panel.getBoundingClientRect();
    const spaceRight = window.innerWidth - ar.right;
    const spaceLeft = ar.left;
    const spaceBottom = window.innerHeight - ar.bottom;
    const spaceTop = ar.top;

    // If there is not enough room to the right, open toward the left side.
    setHAlign(spaceRight >= pr.width || spaceRight >= spaceLeft ? "open-right" : "open-left");
    setVAlign(spaceBottom >= pr.height || spaceBottom >= spaceTop ? "down" : "up");
  }, [open]);

  const copyVerse = async () => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = shareText;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    ta.remove();
  };

  const onShare = async () => {
    setBusy(true);
    try {
      const blob = await captureVerseBlobById(captureElementId);
      if (blob && navigator.share) {
        const file = new File([blob], "refugio-celestial-versiculo.png", {
          type: "image/png",
        });
        const data = { files: [file], text: shareText, title: "Refugio Celestial" };
        if (navigator.canShare?.(data)) {
          await navigator.share(data);
          setOpen(false);
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ text: shareText, title: "Refugio Celestial" });
      } else {
        await copyVerse();
        showToast(
          lang === "es"
            ? "Texto copiado para compartir."
            : "Text copied for sharing.",
          "success",
          2200
        );
      }
      setOpen(false);
    } catch {
      showToast(
        lang === "es"
          ? "No se pudo compartir. Intenta otra opción."
          : "Could not share. Try another option.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async () => {
    setBusy(true);
    try {
      const ok = await downloadVerseCaptureById(captureElementId);
      if (!ok) {
        showToast(
          lang === "es"
            ? "No se pudo generar la imagen."
            : "Could not generate image.",
          "error"
        );
      }
      setOpen(false);
    } catch {
      showToast(
        lang === "es"
          ? "Falló la descarga de la imagen."
          : "Image download failed.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    setBusy(true);
    try {
      await copyVerse();
      showToast(
        lang === "es" ? "Texto copiado al portapapeles." : "Text copied to clipboard.",
        "success",
        2200
      );
      setOpen(false);
    } catch {
      showToast(
        lang === "es"
          ? "No se pudo copiar el texto."
          : "Could not copy text.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  };

  const d = Boolean(disabled || busy);

  return (
    <div ref={boxRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={d}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.actions}
        title={t.actions}
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-gold-500/55 bg-[#1e1508]/95 p-0 text-gold-300 shadow-[0_0_14px_rgba(212,175,55,0.28)] transition hover:border-gold-400 hover:bg-[#2d1f0d] disabled:cursor-wait disabled:opacity-60"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <g fill="#f5e206">
            <circle cx="10" cy="15" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="10" cy="5" r="2" />
          </g>
        </svg>
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="menu"
          className={`absolute z-30 min-w-[10.5rem] rounded-xl border border-gold-500/35 bg-[#0f1228]/95 p-1.5 shadow-[0_0_18px_rgba(0,0,0,0.45)] backdrop-blur-sm ${
            hAlign === "open-left" ? "right-0" : "left-0"
          } ${vAlign === "down" ? "top-12" : "bottom-12"}`}
        >
          <button
            type="button"
            role="menuitem"
            onClick={onShare}
            disabled={d}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-gold-100/95 transition hover:bg-gold-500/10 disabled:opacity-60"
          >
            <i className="fa-solid fa-share-nodes w-4 text-gold-300/90" aria-hidden />
            {t.share}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onDownload}
            disabled={d}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-gold-100/95 transition hover:bg-gold-500/10 disabled:opacity-60"
          >
            <i className="fa-solid fa-download w-4 text-gold-300/90" aria-hidden />
            {t.download}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onCopy}
            disabled={d}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-gold-100/95 transition hover:bg-gold-500/10 disabled:opacity-60"
          >
            <i className="fa-solid fa-copy w-4 text-gold-300/90" aria-hidden />
            {t.copy}
          </button>
        </div>
      ) : null}
    </div>
  );
}
