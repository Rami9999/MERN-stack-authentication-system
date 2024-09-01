import jwt from 'jsonwebtoken'
import { mailtrapClient, sender } from '../mailtrap/mailtrap.config.js';
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from '../mailtrap/emailTemplate.js';

export const generateVerificationCode = () => {
    return Math.floor(100000+Math.random()*900000).toString();
}

export const generateTokenAndSetCookie = (res,id)=>{
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
    return token;
}

export const sendVerificationEmail = async (email,token) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify Your Email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",token),
            category:"Email Verification"
        });

        console.log("Email Sent Successfully",response);

    } catch (error) {
        console.error("Error in sending Verficication Email: ",error);
        throw new Error(`Error sending verification Email: ${email}`);

    }
}

export const sendWelcomeEmail  = async (email,name) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "b77064d4-6a87-41ee-81f9-0710c55bffe1",
            template_variables: {
              "name": name,
              "company_info_name": "Auth Company"
            }
        });

        console.log("Email Sent Successfully",response);

    } catch (error) {
        console.error("Error in sending Welcome Email: ",error);
        throw new Error(`Error sending Welcome Email: ${email}`);

    }
}

export const sendPasswordResetEmail = async (email,url)=>{
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset Your Password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",url),
            category:"Password Reset"
        });

        console.log("Reset Password Email Sent Successfully",response);
    } catch (error) {
        console.error("Error in sending reset passowrd Email: ",error);
        throw new Error(`Error sending  reset passowrd Email: ${email}`);
    }
}

export const sendResetPasswordSuccessEmail = async (email)=>{
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password changed Successfully",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset Successfully"
        });

        console.log("Password changed successfully Email Sent Successfully",response);
    } catch (error) {
        console.error("Error in Password changed successfully Email: ",error);
        throw new Error(`Error in sending Password changed successfully Email to : ${email}`);
    }
}

