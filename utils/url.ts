export function convertParamsToString(params: object) {
  console.log(typeof params);
  let paramString = "";
  Object.entries(params).forEach(([paramName, paramValue], index) => {
    paramString += index === 0 ? "?" : "&";
    paramString += `${paramName}=${encodeURIComponent(
      JSON.stringify(paramValue)
    )}`;
  });
  return paramString;
}

export function getURL(url: string, params: object) {
  return url + convertParamsToString(params);
}
