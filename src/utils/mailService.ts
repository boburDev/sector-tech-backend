import nodemailer from 'nodemailer';

export const mailService = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        html: `<p style="font-size: 20px; font-weight: bold; background-color: red;">Your OTP code is: ${otp}</p>`
    };

    return transporter.sendMail(mailOptions);
};