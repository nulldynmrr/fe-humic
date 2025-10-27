export function formatWaktu(timestamp, mode = "default") {
  try {
    const now = new Date();
    const date = new Date(timestamp);

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (mode === "date") {
      const options = {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("id-ID", options).format(date);
    }

    if (mode === "time") {
      const options = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      const time = new Intl.DateTimeFormat("id-ID", options).format(date);
      return `${time} WIB`;
    }

    if (diffMinutes < 15) {
      return `${diffMinutes === 0 ? 1 : diffMinutes} menit yang lalu`;
    }

    if (diffDays < 7) {
      return `${diffDays === 0 ? 1 : diffDays} hari yang lalu`;
    }

    const options = {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatted = new Intl.DateTimeFormat("id-ID", options).format(date);
    return `${formatted.replace(",", " jam")} WIB`;
  } catch (error) {
    console.error("Gagal memformat waktu:", error);
    return "-";
  }
}
