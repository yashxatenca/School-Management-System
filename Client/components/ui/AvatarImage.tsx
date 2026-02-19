// components/SafeAvatar.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

type SafeAvatarProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, alt, size = 80, className = "" }: SafeAvatarProps) {
  const [error, setError] = useState(false);
  const fallback = "/teacherdefault.png";

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={error || !src ? fallback : src}
        alt={alt}
        fill
        className="rounded-full object-cover"
        onError={() => setError(true)}
        placeholder="blur"
        sizes={`${size}px`}
      />
    </div>
  );
}