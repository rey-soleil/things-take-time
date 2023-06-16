export function convertParamsToString(params: object) {
  let paramString = "";
  let marker = "?";
  Object.entries(params).forEach(([paramName, paramValue], index) => {
    if (!paramValue) return;
    paramString +=
      marker +
      `${paramName}=${encodeURIComponent(
        typeof paramValue === "object" ? JSON.stringify(paramValue) : paramValue
      )}`;
    marker = "&";
  });
  return paramString;
}

export function getURL(url: string, params: object) {
  return url + convertParamsToString(params);
}
