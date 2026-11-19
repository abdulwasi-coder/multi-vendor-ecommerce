export function downloadCsv(
  filename: string,
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
) {
  const escapeCell = (value: string | number | null | undefined) => {
    let text = String(value ?? "");
    if (typeof value !== "number" && /^[=+\-@]/.test(text.trimStart())) {
      text = `'${text}`;
    }
    return `"${text.replaceAll('"', '""')}"`;
  };

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
