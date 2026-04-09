/**
 * Convert an input date string into an ISO date (YYYY-MM-DD).
 *
 * Parses `dateString` using the JavaScript Date constructor and returns the date portion
 * of the resulting ISO string in `YYYY-MM-DD` format.
 *
 * @param dateString - A date string in any format recognized by the JavaScript Date constructor
 * @returns The ISO date portion (`YYYY-MM-DD`) corresponding to `dateString`
 * @throws Error('Invalid date format') if `dateString` cannot be parsed as a valid date
 */
function normalizeDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

/**
 * Normalize various time inputs into a 24-hour `HH:MM` string.
 *
 * Accepts inputs like `H:MM`, `HH:MM`, or those formats followed by `AM`/`PM` (case-insensitive).
 *
 * @param timeString - The input time to normalize (e.g., "9:05", "09:05 PM")
 * @returns The normalized time as a zero-padded 24-hour `HH:MM` string
 * @throws Error('Invalid time format. Use HH:MM or HH:MM AM/PM') if the input doesn't match accepted patterns
 * @throws Error('Invalid time values') if hours are not between 0 and 23 or minutes are not between 0 and 59
 */
function normalizeTime(timeString: string): string {
    // Handle various time formats and convert to HH:MM (24-hour format)
    const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
    const match = timeString.trim().match(timeRegex);

    if (!match) {
        throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
    }

    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[4]?.toUpperCase();

    if (period) {
        // Convert 12-hour to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
    }

    if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
        throw new Error('Invalid time values');
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

export {
    normalizeDate,
    normalizeTime,
};