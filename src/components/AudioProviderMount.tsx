import { useEffect } from "react";

export default function AudioProviderMount() {
  useEffect(() => {
    let el = document.getElementById("np-audio") as HTMLAudioElement | null;
    if (!el) {
      el = document.createElement("audio");
      el.id = "np-audio";
      el.preload = "metadata";
      el.crossOrigin = "anonymous";
      el.style.display = "none";
      document.body.appendChild(el);
    }
  }, []);
  return null;
}