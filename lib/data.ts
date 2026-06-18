import {
  Baby,
  BadgeCheck,
  Bath,
  HeartHandshake,
  PackageCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

export const categories = [
  { name: "Diapers", count: "36 essentials", icon: Baby, color: "mint" },
  { name: "Feeding", count: "24 picks", icon: ShoppingBag, color: "peach" },
  { name: "Clothing", count: "42 styles", icon: Shirt, color: "sky" },
  { name: "Bath Care", count: "18 gentle items", icon: Bath, color: "lavender" },
];

export const products = [
  {
    name: "CloudSoft Diapers",
    tag: "Best seller",
    price: "$18.99",
    description: "Breathable overnight absorbency for sensitive skin.",
    image:
      "https://images.unsplash.com/photo-1584839404042-8bc21d240e91?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Organic Apple Puree",
    tag: "6+ months",
    price: "$5.50",
    description: "Single-ingredient puree with no added sugar.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Cotton Onesie Set",
    tag: "New arrival",
    price: "$22.00",
    description: "Soft everyday outfits with easy snap closures.",
    image:
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Calm Bath Bundle",
    tag: "Derm tested",
    price: "$16.75",
    description: "Gentle wash, lotion, and soft towel for bath time.",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
  },
];

export const trustItems = [
  {
    title: "Parent-safe picks",
    body: "Age filters, material notes, and practical guidance built into every product section.",
    icon: HeartHandshake,
  },
  {
    title: "Fast doorstep delivery",
    body: "Bundle diapers, feeding, bath, and clothing essentials into one clean checkout flow.",
    icon: Truck,
  },
  {
    title: "Verified product care",
    body: "Clear storage, return, and safety notes help parents shop with confidence.",
    icon: BadgeCheck,
  },
];

export const steps = [
  "Choose your baby's age range and product category.",
  "Compare essentials with clear safety and care notes.",
  "Add items to cart and review shipping before checkout.",
  "Track orders and save favorites for the next restock.",
];

export const featureStats = [
  { label: "Curated categories", value: "12+" },
  { label: "Parent support topics", value: "40+" },
  { label: "Checkout steps", value: "3" },
];

export const docSections = [
  { href: "/docs/user", label: "User Guide", icon: PackageCheck },
  { href: "/docs/developer", label: "Developer Docs", icon: Sparkles },
];
