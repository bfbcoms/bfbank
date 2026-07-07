import logoAsset from "@/assets/bfb-logo.png.asset.json";

type Props = {
  className?: string;
  alt?: string;
};

/**
 * Bright Future Bank brand mark. Use everywhere a logo is displayed.
 */
export function BrandLogo({ className, alt = "Bright Future Bank" }: Props) {
  return (
    <img
      src={logoAsset.url}
      alt={alt}
      className={className}
      width={512}
      height={512}
      loading="eager"
      decoding="async"
    />
  );
}

export const BRAND_LOGO_URL = logoAsset.url;
