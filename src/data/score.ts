export function category(score: number) {
  if (score >= 80)
    return {
      label: "High",
      cls: "bg-accent2-800 text-accent2-100",
      bar: "bg-accent-2",
    };
  if (score >= 60)
    return {
      label: "Moderate",
      cls: "bg-accent-800 text-accent-100",
      bar: "bg-accent",
    };
  if (score >= 40)
    return {
      label: "Low",
      cls: "bg-warn-bg text-warn-text",
      bar: "bg-warn-text",
    };
  return {
    label: "Risky",
    cls: "bg-critical-bg text-critical-text",
    bar: "bg-critical-text",
  };
}
