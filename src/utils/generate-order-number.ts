export const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    return `UZ${year}${randomDigits}`; // UZ251234567
};
