import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config();

export const mailService = async (email: string, otp: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true,
            debug: true,
        });

        await transporter.verify();

        const mailOptions = {
            from: `"OTP Service" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            html: `<p style="font-size: 20px; font-weight: bold; background-color: red;">Your OTP code is: ${otp}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);

        return { success: true, message: "OTP email sent successfully" };
    } catch (error) {
        console.error("Email sending error:", error);
        return { success: false, message: "Error sending OTP", error };
    }
};