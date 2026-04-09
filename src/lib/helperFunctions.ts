// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
        throw new Error('Invalid date format');
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    if (month < 1 || month > 12) {
        throw new Error('Invalid date format');
    }

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    if (day < 1 || day > daysInMonth) {
        throw new Error('Invalid date format');
    }

    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Helper function to normalize time format
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
        if (hours < 1 || hours > 12) {
            throw new Error('Invalid 12-hour time');
        }

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
