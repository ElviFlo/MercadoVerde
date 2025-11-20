import { useState } from "react";

export default function Kora() {
  const [active, setActive] = useState(false);

  return (
    <button onClick={() => setActive(prev => !prev)} className={`fixed bottom-4 right-4 w-12 h-12 cursor-pointer rounded-full flex items-center justify-center transition-colors
            ${active ? "bg-[#FD5053] text-white" : "bg-[#1F9537] text-[#D6FDEE]"}`}>
      {active ? <i className="ti ti-player-stop-filled text-xl"></i> : <i className="ti ti-microphone text-xl"></i>}
    </button>
  )
}
