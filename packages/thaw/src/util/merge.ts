export default function merge(a, b) {
  if (a === undefined) {
    return b;
  }

  if (typeof a !== "object" || a === null) {
    return b;
  }

  if (typeof b !== "object") {
    return b;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return b;
  }

  if (Array.isArray(a)) {
    return [...a, ...b];
  }

  const result = {};
  for (const key of Object.keys(a)) {
    result[key] = merge(a[key], b[key]);
  }

  return result;
}
