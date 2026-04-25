export type ToastKind = "error" | "warning" | "success" | "info";

type ToastPayload = {
  message: string;
  kind?: ToastKind;
  durationMs?: number;
};

export function showToast(message: string, kind: ToastKind = "info", durationMs = 3600): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastPayload>("refugio:toast", {
      detail: { message, kind, durationMs },
    })
  );
}
