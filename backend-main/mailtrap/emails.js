const {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
} = require("./emailTemplates.js");
const { mailtrapClient, sender } = require("./mailtrap.config.js");

const sendVerificationEmail = async (email, verificationToken) => {
    if (!mailtrapClient) {
        console.log(`[local email] Verification code for ${email}: ${verificationToken}`);
        return false;
    }

    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully", response);
        return true;
    } catch (error) {
        console.error(`Error sending verification`, error);
        console.log(`[local email] Verification code for ${email}: ${verificationToken}`);
        return false;
    }
};

const sendWelcomeEmail = async (email, name) => {
    if (!mailtrapClient) {
        console.log(`[local email] Welcome email skipped for ${email}`);
        return;
    }

    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "487462f1-f183-4cf8-9142-03df50b49b89",
            template_variables: {
                "name": name,
                "company_info_name": "Test_Company_info_name",
                "company_info_address": "Test_Company_info_address",
                "company_info_city": "Test_Company_info_city",
                "company_info_zip_code": "Test_Company_info_zip_code",
                "company_info_country": "Test_Company_info_country"
            }
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

const sendPasswordResetEmail = async (email, resetURL) => {
    if (!mailtrapClient) {
        console.log(`[local email] Password reset link for ${email}: ${resetURL}`);
        return;
    }

    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

const sendResetSuccessEmail = async (email) => {
    if (!mailtrapClient) {
        console.log(`[local email] Password reset success notice skipped for ${email}`);
        return;
    }

    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error(`Error sending password reset success email`, error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
};

