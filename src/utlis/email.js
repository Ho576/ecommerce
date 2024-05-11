import nodemailer from "nodemailer";

async function SendEmail(to,subject,html) {
    
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ACCOUNT,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `H-shop <${process.env.EMAIL_ACCOUNT}>`,
            to,
            subject,
            html,
        });


}

export default SendEmail;