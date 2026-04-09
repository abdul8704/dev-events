// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
    // Validate strict YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        throw new Error('Invalid date format');
    }

    // Parse year, month, day
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));

    // Validate month range
    if (month < 1 || month > 12) {
        throw new Error('Invalid date format');
    }

    // Determine days in month (accounting for leap years)
    const daysInMonth = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Validate day range for the given month
    if (day < 1 || day > daysInMonth[month - 1]) {
        throw new Error('Invalid date format');
    }

    // Construct date in UTC to avoid timezone shifts
    const date = new Date(Date.UTC(year, month - 1, day));

    // Return normalized YYYY-MM-DD string
    return date.toISOString().split('T')[0];
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
        // Validate 12-hour range before conversion
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