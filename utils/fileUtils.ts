export const getFileNameFromUri = (uri: string) => {
  if (!uri) return "";
  return uri.split("/").pop() || "Unknown file";
};