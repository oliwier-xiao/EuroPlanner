import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "light" | "dark";
  width?: number;
  href?: string;
  className?: string;
  priority?: boolean;
};

const ASPECT_RATIO = 520 / 328;

export function Logo({
  variant = "light",
  width = 180,
  href,
  className,
  priority = false,
}: LogoProps) {
  const src = variant === "dark" ? "/icons/logo-dark.png" : "/icons/logo-light.png";
  const height = Math.round(width / ASPECT_RATIO);

  const image = (
    <Image
      src={src}
      alt="EuroPlanner"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="EuroPlanner - przejdź do pulpitu"
        className="inline-flex items-center transition-opacity hover:opacity-90"
      >
        {image}
      </Link>
    );
  }

  return image;
}
