import * as AWS from "aws-sdk";
import { EMAIL } from "../constants/email.constant";

const Mail = (from: string, to: string, subject: string, text: string, html: string) => {
	AWS.config.update({
		accessKeyId: process.env.EMAIL_ACCESS_KEY,
		secretAccessKey: process.env.EMAIL_SECRET_KEY,
		region: process.env.EMAIL_REGION, // Must be the same as your bucket
	});

	const ses = new AWS.SES({ apiVersion: "2010-12-01" });
	const promise = new Promise((resolve, reject) => {
		const params = {
			Destination: {
				ToAddresses: [to], // Email address/addresses that you want to send your email
			},
			Message: {
				Body: {
					Html: {
						// HTML Format of the email
						Charset: "UTF-8",
						Data: html,
					},
					Text: {
						Charset: "UTF-8",
						Data: text,
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: subject,
				},
			},
			Source: `${EMAIL.SENDER_NAME} <${EMAIL.SENDER_EMAIL}>}`,
		};

		if (process.env.NODE_ENV === "test") return resolve(true);

		const sendEmail = ses.sendEmail(params).promise();
		console.log("subject", subject);

		sendEmail
			.then(data => {
				console.log("email submitted to SES", data);
				resolve(true);
			})
			.catch(error => {
				console.log("SES Error", error);
				reject(error);
			});
	});
	return promise;
};

export default Mail;
