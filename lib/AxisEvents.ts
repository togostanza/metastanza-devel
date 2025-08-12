// Shared helpers to handle axis change events across stanzas
export type AxisLetter = "x" | "y" | "z";

export type ValidationRule = "nonNull" | "numeric" | "any";

const defaultValidators: Record<AxisLetter, ValidationRule> = {
  x: "nonNull",
  y: "numeric",
  z: "numeric",
};

function validateKeyPresence(data: any[], key: string) {
  return Array.isArray(data) && data.some((d) => Object.prototype.hasOwnProperty.call(d, key));
}

function validateByRule(data: any[], key: string, rule: ValidationRule) {
  switch (rule) {
    case "numeric":
      return (
        Array.isArray(data) &&
        data.some((d) => {
          const v = d?.[key];
          const n = +v;
          return v !== undefined && v !== null && Number.isFinite(n);
        })
      );
    case "nonNull":
      return Array.isArray(data) && data.some((d) => d?.[key] !== undefined && d?.[key] !== null);
    case "any":
    default:
      return true;
  }
}

export function applyAxisChange(
  element: Element,
  data: any[],
  axis: AxisLetter,
  key: string,
  rule: ValidationRule = defaultValidators[axis]
): boolean {
  if (typeof key !== "string" || key.length === 0) {
    console.warn(`[axis] Received '${axis}axis' with invalid detail:`, key);
    return false;
  }
  if (!validateKeyPresence(data, key)) {
    console.warn(`[axis] Key '${key}' not found in data.`);
    return false;
  }
  if (!validateByRule(data, key, rule)) {
    const msg = rule === "numeric" ? "has no numeric values" : "has no valid values";
    console.warn(`[axis] Key '${key}' ${msg} for ${axis}-axis.`);
    return false;
  }

  element.setAttribute(`axis-${axis}-key`, key);
  const titleAttr = `axis-${axis}-title`;
  if (!element.getAttribute(titleAttr)) {
    element.setAttribute(titleAttr, key);
  }
  return true;
}

export function handleAxisEvent(
  element: Element,
  data: any[],
  event: Event,
  config?: {
    validators?: Partial<Record<AxisLetter, ValidationRule>>;
    supported?: AxisLetter[];
  }
): boolean {
  const type = event.type;
  const axis = type === "xaxis" ? "x" : type === "yaxis" ? "y" : type === "zaxis" ? "z" : undefined;
  if (!axis) return false;
  if (config?.supported && !config.supported.includes(axis)) return false;
  const key = (event as CustomEvent<string>).detail;
  const rule = config?.validators?.[axis] ?? defaultValidators[axis];
  return applyAxisChange(element, data, axis, key, rule);
}
