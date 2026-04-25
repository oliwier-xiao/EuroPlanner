"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AVATARS, type Avatar } from "@/lib/avatars";

type Props = {
  open: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function AvatarPicker({ open, selectedId, onSelect, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const smileys = AVATARS.filter((a) => a.category === "smiley");
  const animals = AVATARS.filter((a) => a.category === "animal");

  const renderGroup = (title: string, items: Avatar[]) => (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#5b616e]">{title}</h3>
      <div className="grid grid-cols-5 gap-3">
        {items.map((avatar) => {
          const isSelected = avatar.id === selectedId;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => {
                onSelect(avatar.id);
                onClose();
              }}
              aria-label={`Wybierz awatar: ${avatar.name}`}
              aria-pressed={isSelected}
              className={`relative aspect-square overflow-hidden rounded-full border-2 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E67BF] focus-visible:ring-offset-2 ${
                isSelected
                  ? "border-[#3E67BF] ring-2 ring-[#3E67BF] ring-offset-2"
                  : "border-transparent hover:border-[#3E67BF]/50"
              }`}
            >
              <Image
                src={avatar.src}
                alt=""
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-picker-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 id="avatar-picker-title" className="text-xl font-bold text-[#0a0b0d]">
            Wybierz awatar
          </h2>
          <button
            onClick={onClose}
            aria-label="Zamknij wybór awatara"
            className="p-2 -m-2 text-[#5b616e] hover:text-[#0a0b0d] hover:bg-gray-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E67BF]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-6">
          {renderGroup("Buźki", smileys)}
          {renderGroup("Zwierzaki", animals)}
        </div>
      </div>
    </div>
  );
}
