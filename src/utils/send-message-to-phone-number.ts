import axios from 'axios';
import FormData from 'form-data';

const authService = async (email = "shaxriyorziyodullayev816@gmail.com", password = "DvcIm7wWHW95yfX2Q8D2jOWvUOpqZGWTVWEZ6bMP") => {
    try {
        const form = new FormData();
        form.append('email', email);
        form.append('password', password);

        const response = await axios.post("https://notify.eskiz.uz/api/auth/login", form);

        const result = response.data;

        if (response.status === 200 && result.data?.token) {
            return { success: true, token: result.data.token };
        }

        return { success: false, error: result.message || "Authentication failed" };
    } catch (err) {
        console.error("Auth error:", err);
        return { success: false, error: "Unexpected error during authentication" };
    }
};

const sendSmsTo = async (phoneNumber: string, message: string) => {
    const auth = await authService('shaxriyorziyodullayev816@gmail.com', 'DvcIm7wWHW95yfX2Q8D2jOWvUOpqZGWTVWEZ6bMP');
    if (!auth.success) {
        return { success: false, error: auth.error };
    }

    try {
        const form = new FormData();
        form.append('mobile_phone', phoneNumber);
        form.append('message', message);
        form.append('from', '4546');

        const response = await axios.post("https://notify.eskiz.uz/api/message/sms/send", form, {
            headers: {
                "Authorization": `Bearer ${auth.token}`
            },
        });

        const result = response.data;

        if (response.status === 200) {
            return { success: true, data: result };
        }

        return { success: false, error: result.message || "Failed to send SMS" };
    } catch (err) {
        console.error("SMS error:", err);
        return { success: false, error: "Unexpected error while sending SMS" };
    }
};

export default sendSmsTo;