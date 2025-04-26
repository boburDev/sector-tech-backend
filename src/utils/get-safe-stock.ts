export function getSafeStock(inStock: string | number | null | undefined): number {
    if (typeof inStock === 'number' && inStock >= 0) return inStock;

    if (typeof inStock === 'string') {
        const digits = inStock.match(/\d+/); // faqat raqamlarni ajratadi (100+ => 100)
        if (digits) {
            const num = parseInt(digits[0], 10);
            return Number.isFinite(num) ? num : 0;
        }
    }

    return 0;
}
