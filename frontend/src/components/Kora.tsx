// src/components/Kora.tsx
import { useRef, useState } from "react";
import { sendVoiceCommand } from "../api/kora";
import {
  getCartItems,
  setCartItems,
  type CartItemData,
} from "../cartStorage";

type ToastState =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

export default function Kora() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setToast({
        type: "error",
        message: "Tu navegador no soporta grabación de audio.",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // detener el micrófono
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        // enviar el audio al backend
        void sendToKora(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error("[Kora] error al iniciar grabación:", err);
      setToast({
        type: "error",
        message:
          err?.message ??
          "No se pudo acceder al micrófono. Revisa permisos del navegador.",
      });
    }
  };

  const stopRecording = () => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    }
    setIsRecording(false);
  };

  const syncKoraResultIntoLocalCart = (res: any) => {
    const product = res?.product;
    if (!product) return;

    const current = getCartItems();

    // Intentar obtener la cantidad real desde el cart devuelto por el backend
    let backendQty: number | undefined;
    const cartItems = res?.cart?.items;
    if (Array.isArray(cartItems)) {
      const backendItem =
        cartItems.find(
          (it: any) =>
            it.productId === product.id ||
            it.product?.id === product.id,
        ) ?? null;
      if (backendItem && backendItem.quantity != null) {
        const n = Number(backendItem.quantity);
        if (!Number.isNaN(n) && n > 0) backendQty = n;
      }
    }

    const itemsCopy: CartItemData[] = [...current];
    const idx = itemsCopy.findIndex((it) => it.id === product.id);

    const newQty =
      backendQty ??
      (idx >= 0 ? itemsCopy[idx].quantity + 1 : 1);

    if (idx >= 0) {
      itemsCopy[idx] = {
        ...itemsCopy[idx],
        quantity: newQty,
      };
    } else {
      itemsCopy.push({
        id: product.id,
        name: product.name,
        type: product.type ?? "plant",
        price: Number(product.price) || 0,
        quantity: newQty,
        imageUrl: product.imageUrl ?? "/plants/plant.png",
      });
    }

    setCartItems(itemsCopy);

    // Notificar a cualquier vista interesada (por ejemplo, Cart) que el carrito cambió
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kora-cart-updated"));
    }
  };

  const sendToKora = async (audio: Blob) => {
    try {
      setIsSending(true);
      const res = await sendVoiceCommand(audio);
      console.log("[Kora] respuesta:", res);

      // Sincronizar también el carrito local del frontend
      syncKoraResultIntoLocalCart(res);

      setToast({
        type: "success",
        message: res.message ?? "Comando procesado correctamente.",
      });
    } catch (err: any) {
      console.error("[Kora] error enviando audio:", err);
      setToast({
        type: "error",
        message:
          err?.message ??
          "No pude procesar tu comando de voz. Intenta de nuevo.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClick = () => {
    if (isSending) return; // evitar clicks mientras envía

    if (!isRecording) {
      // empezar a grabar
      void startRecording();
    } else {
      // parar y enviar
      stopRecording();
    }
  };

  const isActive = isRecording || isSending;

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={handleClick}
        className={`fixed bottom-4 right-4 z-40 w-12 h-12 cursor-pointer rounded-full flex items-center justify-center shadow-lg transition-colors
        ${
          isActive
            ? "bg-[#FD5053] text-white"
            : "bg-[#1F9537] text-[#D6FDEE]"
        }`}
        title={
          isSending
            ? "Enviando comando..."
            : isRecording
            ? "Haz click para terminar la grabación"
            : "Haz click para hablar con Kora"
        }
        disabled={isSending}
      >
        {isSending ? (
          // pequeño spinner
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isRecording ? (
          <i className="ti ti-player-stop-filled text-xl" />
        ) : (
          <i className="ti ti-microphone text-xl" />
        )}
      </button>

      {/* Toast sencillo de feedback */}
      {toast && (
        <div
          className={`fixed bottom-20 right-4 z-40 max-w-xs px-4 py-3 rounded-lg text-sm text-white shadow-lg flex items-center gap-2
          ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
        >
          <i
            className={`ti ${
              toast.type === "success" ? "ti-check" : "ti-alert-circle"
            } text-lg`}
          />
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-xs opacity-80 hover:opacity-100 underline"
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
