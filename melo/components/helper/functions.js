export function objectToUrlParams(obj) {
  const params = Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
  return params;
}
