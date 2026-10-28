export function withUniqueUploadName(file: File): File {
  const extensionIndex = file.name.lastIndexOf(".");
  const extension = extensionIndex > 0 ? file.name.slice(extensionIndex) : "";
  const originalName = extensionIndex > 0 ? file.name.slice(0, extensionIndex) : file.name;

  return new File([file], `${originalName}-${crypto.randomUUID()}${extension}`, {
    type: file.type,
    lastModified: file.lastModified,
  });
}