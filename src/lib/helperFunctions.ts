function formatDateParts(year: number, month: number, day: number): string {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
        throw new Error('Invalid date format');
    }

    return `${year.toString().padStart(4, '0')}-${month
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function tryParseNumericDate(dateString: string): string | null {
    const parts = dateString.split(/[-/.]/).map((part) => part.trim());

    if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) {
        return null;
    }

    if (parts[0].length === 4) {
        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        return formatDateParts(year, month, day);
    }

    if (parts[2].length === 4) {
        const first = Number(parts[0]);
        const second = Number(parts[1]);
        const year = Number(parts[2]);

        if (first > 12) {
            return formatDateParts(year, second, first);
        }

        if (second > 12) {
            return formatDateParts(year, first, second);
        }

        return formatDateParts(year, second, first);
    }

    return null;
}

/**
 * Convert a date string into an ISO date (`YYYY-MM-DD`).
 *
 * Supported numeric formats include `YYYY-MM-DD`, `YYYY/MM/DD`, `DD-MM-YYYY`,
 * `DD/MM/YYYY`, `MM-DD-YYYY`, and `MM/DD/YYYY`. When both day/month positions
 * are ambiguous, the function prefers day-month-year. It also accepts month-name
 * dates that the JavaScript `Date` constructor can parse reliably.
 *
 * @param dateString - The input date string
 * @returns The normalized ISO date string
 * @throws Error('Invalid date format') if the input cannot be parsed as a valid date
 */
function normalizeDate(dateString: string): string {
    const input = dateString.trim();

    if (!input) {
        throw new Error('Invalid date format');
    }

    if (/^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}$/.test(input)) {
        const parsedNumericDate = tryParseNumericDate(input);

        if (parsedNumericDate) {
            return parsedNumericDate;
        }
    }

    const parsedDate = new Date(input);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
    }

    return formatDateParts(
        parsedDate.getFullYear(),
        parsedDate.getMonth() + 1,
        parsedDate.getDate()
    );
}

/**
 * Normalize various time inputs into a 24-hour `HH:MM` string.
 *
 * Supported inputs include `9`, `09`, `930`, `09:30`, `9.30`, `9 PM`,
 * `09:30 PM`, and `09:30:45`.
 *
 * @param timeString - The input time string
 * @returns The normalized time as `HH:MM`
 * @throws Error('Invalid time format. Use HH:MM or HH:MM AM/PM') if parsing fails
 * @throws Error('Invalid time values') if the parsed hour/minute values are out of range
 */
function normalizeTime(timeString: string): string {
    const input = timeString.trim().toUpperCase();

    if (!input) {
        throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
    }

    const match = input.match(
        /^(\d{1,2})(?:(?::|\.|H)?(\d{2}))?(?:(?::|\.)(\d{2}))?\s*(AM|PM)?$/
    );

    if (!match) {
        throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2] ?? '0');
    const period = match[4];

    if (minutes < 0 || minutes > 59) {
        throw new Error('Invalid time values');
    }

    if (period) {
        if (hours < 1 || hours > 12) {
            throw new Error('Invalid time values');
        }

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        }

        if (period === 'AM' && hours === 12) {
            hours = 0;
        }
    } else if (hours < 0 || hours > 23) {
        throw new Error('Invalid time values');
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
}

export {
    normalizeDate,
    normalizeTime,
};
