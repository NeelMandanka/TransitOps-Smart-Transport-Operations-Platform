export const fmtINR = (n) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(n || 0));

export const fmtNum = (n, unit = "") =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(Number(n || 0)) +
  (unit ? ` ${unit}` : "");

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const isExpired = (dateStr) => dateStr && new Date(dateStr) < new Date(todayISO());

export const expiresSoon = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
  return d >= now && d <= in30;
};

export function downloadCSV(filename, headers, rows) {
  const escape = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
