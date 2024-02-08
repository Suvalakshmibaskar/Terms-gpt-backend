import nodemailer from "nodemailer";

const Mail = (from: string, to: string, subject: string, text: string, html: string) => {
	const promise = new Promise((resolve, reject) => {
		// Send Mail
		nodemailer.createTestAccount(() => {
			const transporter = nodemailer.createTransport({
				host: "pro1.mail.ovh.net",
				port: 587,
				tls: {
					ciphers: "SSLv3",
				}, // true for 465, false for other ports
				auth: {
					user: "p7@tionkar.com", // generated ethereal user
					pass: "pSeven!zsoawesome", // generated ethereal password
				},
			});

			// setup email data with unicode symbols
			const mailOptions = {
				from: "<p7@tionkar.com>", // sender address
				to: to, // list of receivers
				subject: subject, // Subject line
				text: text, // plain text body
				html: html, // html body
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
					reject(false);
					return;
				}
				console.log(info);
				resolve(true);
			});
		});
	});
	return promise;
};

export default Mail;
