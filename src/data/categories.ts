export const categories = [
  { value: "CLOTHING", label: "Clothing" },
  { value: "PERFUMES", label: "Perfumes & Oud" },
  { value: "BEAUTY", label: "Beauty & Skincare" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "HOME", label: "Home & Kitchen" },
  { value: "SWEETS", label: "Sweets & Dates" },
  { value: "COFFEE", label: "Coffee & Tea" },
  { value: "GIFTS", label: "Gifts & Flowers" },
];

export function getCategoryLabel(value: string) {
  return categories.find((c) => c.value === value)?.label ?? value;
}
