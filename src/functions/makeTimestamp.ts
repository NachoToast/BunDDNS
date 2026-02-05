
const format = new Intl.DateTimeFormat("en-NZ", {
    second: "2-digit",
    minute: "2-digit",
    hour: "numeric",
    hour12: true,

    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

export function makeTimestamp(): string {
    return format.format(new Date());
}
