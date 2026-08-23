import type { LucideIcon } from "lucide-react";

export type LandingNavbarProps = {
  logo?: boolean;
};

export type FooterProps = {
  className?: string;
};

export type FeatureCardProps = {
  name: string;
  description: string;
  img?: string;
  icon?: LucideIcon;
  title?: string;
  badgeText?: string;
  gradientClass?: string;
  iconColorClass?: string;
};

export type PremiumCardProps = {
  title: string;
  price: number;
  className?: string;
  icon?: string;
  features: string[];
  btn?: boolean;
  isPopular?: boolean;
};

