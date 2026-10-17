export const cities = [
  { value: "RIYADH", label: "Riyadh" },
  { value: "JEDDAH", label: "Jeddah" },
  { value: "MAKKAH", label: "Makkah" },
  { value: "MADINAH", label: "Madinah" },
  { value: "DAMMAM", label: "Dammam" },
  { value: "KHOBAR", label: "Al Khobar" },
  { value: "DHAHRAN", label: "Dhahran" },
  { value: "TAIF", label: "Taif" },
  { value: "TABUK", label: "Tabuk" },
  { value: "BURAIDAH", label: "Buraidah" },
  { value: "ABHA", label: "Abha" },
  { value: "KHAMIS_MUSHAIT", label: "Khamis Mushait" },
  { value: "HAIL", label: "Hail" },
  { value: "JAZAN", label: "Jazan" },
  { value: "NAJRAN", label: "Najran" },
  { value: "AL_AHSA", label: "Al Ahsa" },
  { value: "JUBAIL", label: "Jubail" },
  { value: "YANBU", label: "Yanbu" },
];

export function getCityLabel(value: string) {
  return cities.find((c) => c.value === value)?.label ?? value;
}
