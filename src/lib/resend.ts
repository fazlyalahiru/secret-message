import { apiResponse } from '@/types/apiResponse';
import { Resend } from 'resend';
import VerificaitonEmailTemplate from '../../emails/verificationEmailTemplate';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const verificationEmail = async (username: string, email: string, verifycode: string): Promise<apiResponse> => {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'OTP Verification ',
            react: VerificaitonEmailTemplate({ username: username, otp: verifycode }),
        });

        return { success: true, message: "verification email sent successfully" }
    } catch (emailErr) {
        console.log("email could not be sent", emailErr);
        return {
            success: false, message: "Error occured while sending the email"
        }
    }
}