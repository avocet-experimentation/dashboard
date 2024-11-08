export const lastUpdated = (unixTimestamp: number): string => {
  // Ensure the timestamp is in milliseconds
  const timestamp =
    unixTimestamp.toString().length === 10
      ? unixTimestamp * 1000
      : unixTimestamp;
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  // Define time intervals in seconds
  const intervals: { label: string; seconds: number }[] = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  // Find the largest applicable time interval
  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export const formatDate = (unixTimestamp: number): string => {
  // Ensure the timestamp is in milliseconds
  const timestamp =
    unixTimestamp.toString().length === 10
      ? unixTimestamp * 1000
      : unixTimestamp;
  const date = new Date(timestamp);

  // Format options for "Month Day, Year"
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};
