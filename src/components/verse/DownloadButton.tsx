import { useState } from "react";
import type { Lang } from "@/lib/domain/types";
import { UI } from "@/lib/i18n/labels";
import { showToast } from "@/lib/ui/toast";
import html2canvas from "html2canvas";

type Props = {
  captureElementId: string;
  lang: Lang;
  /** When the verse is refreshing, also disable. */
  disabled?: boolean;
  iconOnlyMobile?: boolean;
  className?: string;
};

const PNG_FILE = "refugio-celestial-versiculo.png";

function triggerDownload(url: string, filename: string): boolean {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    return false;
  }
}

export async function captureVerseBlobById(
  captureElementId: string
): Promise<Blob | null> {
  const el = document.getElementById(captureElementId);
  if (!el) return null;

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  try {
    const canvas = await html2canvas(el, {
      scale: Math.min(2.2, (window.devicePixelRatio || 1) * 1.25),
      backgroundColor: "#12132a",
      useCORS: true,
      allowTaint: false,
      logging: false,
    });
    return await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1)
    );
  } catch {
    return null;
  }
}

export async function downloadVerseCaptureById(
  captureElementId: string,
  filename = PNG_FILE
): Promise<boolean> {
  const blob = await captureVerseBlobById(captureElementId);
  if (!blob) return false;

  const objectUrl = URL.createObjectURL(blob);
  const started = triggerDownload(objectUrl, filename);
  if (!started) {
    window.open(objectUrl, "_blank", "noopener,noreferrer");
  }
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  return true;
}

/**
 * Renders a button that exports the verse card area as a PNG (client-side).
 */
export function DownloadButton({
  captureElementId,
  lang,
  disabled,
  iconOnlyMobile = false,
  className = "",
}: Props) {
  const L = UI[lang];
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setBusy(true);
    try {
      const ok = await downloadVerseCaptureById(captureElementId, PNG_FILE);
      if (!ok) {
        showToast(
          lang === "es"
            ? "No se pudo generar la imagen para descargar."
            : "Could not generate image for download.",
          "error"
        );
      }
    } catch {
      showToast(
        lang === "es"
          ? "Falló la descarga de la imagen. Intenta nuevamente."
          : "Image download failed. Please try again.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  };

  const d = Boolean(disabled || busy);

  return (
    <button
      type="button"
      onClick={handle}
      disabled={d}
      aria-label={L.download}
      title={L.download}
      className={`inline-flex items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/5 text-sm font-semibold text-gold-200/90 transition hover:border-gold-500/50 hover:bg-gold-500/10 disabled:cursor-wait disabled:opacity-60 ${
        iconOnlyMobile ? "min-h-10 min-w-10 p-0" : "min-h-11 gap-2 px-4 py-2.5"
      } ${className}`.trim()}
    >
      {busy ? (
        <i className="fa-solid fa-spinner fa-spin" aria-hidden />
      ) : iconOnlyMobile ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            fill="#f5e206"
            d="M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z"
          />
        </svg>
      ) : (
        <i className="fa-solid fa-image" aria-hidden />
      )}
      {!iconOnlyMobile && L.download}
      {iconOnlyMobile && <span className="sr-only">{L.download}</span>}
    </button>
  );
}
