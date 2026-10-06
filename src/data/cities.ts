export const cities = [
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
  { value: "makkah", label: "Makkah" },
  { value: "madinah", label: "Madinah" },
  { value: "dammam", label: "Dammam" },
  { value: "khobar", label: "Al Khobar" },
  { value: "dhahran", label: "Dhahran" },
  { value: "taif", label: "Taif" },
  { value: "tabuk", label: "Tabuk" },
  { value: "buraidah", label: "Buraidah" },
  { value: "abha", label: "Abha" },
  { value: "khamis-mushait", label: "Khamis Mushait" },
  { value: "hail", label: "Hail" },
  { value: "jazan", label: "Jazan" },
  { value: "najran", label: "Najran" },
  { value: "al-ahsa", label: "Al Ahsa" },
  { value: "jubail", label: "Jubail" },
  { value: "yanbu", label: "Yanbu" },
];

export function getCityLabel(value: string) {
  return cities.find((c) => c.value === value)?.label ?? value;
}
