import { Types } from "mongoose";

export const EMAIL = {
	SENDER_EMAIL: "kishore@brownbutton.io",
	SENDER_NAME: "Brownbutton",
	CONFIRM_EMAIL_SUBJECT: "Livyana | Confirm Your Account",
};

export const EMAIL_TEMPLATES = {
	forgotPassword: (id: Types.ObjectId) => {
		return `<h4>Please click here to reset your password</h4>
    <a href="${process.env.DOMAIN}/reset_password/${id}">Reset Password</a>;`;
	},
	sendOtp: (name: string, otp: string) => {
		return `<p>Hi ${name}</p><p>Your one time password for off leash training.</p></p>OTP: ${otp}</p>`;
	},
	welcomeEmail: async (name: string) => {
		const html = `
        <p>Hi ${name},</p>
        <p>All done! Your Livyana setup is done now.</p>
      `;
		return html;
	},

	confirmEmail: (name: string, id: Types.ObjectId) => {
		const html = `
      Hi ${name},
      <br/>
      <br/>
      You’re almost ready to start using Livyana.
      <br/>
      <br/>
      Simply click the link below to verify your email address.
      <br/>
      <br/>
      <a href="${process.env.DOMAIN}/confirm_email/${id}">Confirm Account</a>
      <br/>
      <br/>
      <br/>
      Thanks,
      <br/>
      Livyana Team
      `;
		return html;
	},
};
