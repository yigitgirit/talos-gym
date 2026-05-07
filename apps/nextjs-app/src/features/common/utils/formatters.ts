/**
 * Masks a phone number, leaving only the last 4 digits visible.
 * Example: "+905551234567" -> "+∗∗∗∗∗∗∗∗4567"
 */
export function maskPhone(phoneNumber: string | number): string {
    const phone = String(phoneNumber).trim();

    if (!phone || phone.length <= 4) {
        return phone;
    }

    return phone.replace(/\d(?!\d{0,3}$)/g, "∗");
}

/**
 * Masks an email address for privacy.
 * Example: "yigit.girit@example.com" -> "yi∗∗∗t@example.com"
 */
export function maskEmail(email: string): string {
    if (!email?.includes("@")) return email;

    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
        return `${localPart}∗∗∗@${domain}`;
    }

    const firstChars = localPart.substring(0, 2);
    const lastChar = localPart.substring(localPart.length - 1);
    
    return `${firstChars}∗∗∗${lastChar}@${domain}`;
}

/**
 * Formats a number into a localized currency string.
 * Default: TRY (Turkish Lira)
 */
export function formatCurrency(amount: number, currency = 'TRY', locale = 'tr-TR'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Formats an ISO date string or Date object into a readable short date.
 * Example: "Oct 12, 2023"
 */
export function formatDate(dateInput: string | Date, locale = 'en-US'): string {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

/**
 * Capitalizes the first letter of a string and lowercases the rest.
 * Useful for normalizing names.
 */
export function capitalizeName(name: string): string {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}