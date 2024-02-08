// Load the AWS SDK for Node.js
import * as AWS from "aws-sdk";

export const sendSMS = async (phone, message) => {
	return new Promise((resolve, reject) => {
		AWS.config.update({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION,
			signatureVersion: "v4",
		});
		// Create publish parameters
		const params = {
			Message: message /* required */,
			PhoneNumber: phone,
		};

		// Create promise and SNS service object
		const publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" }).publish(params).promise();

		// Handle promise's fulfilled/rejected states
		publishTextPromise
			.then(function (data) {
				console.log("MessageID is " + data.MessageId);
				resolve(true);
			})
			.catch(function (err) {
				console.error(err, err.stack);
				reject(err);
			});
	});
};

export const setSMSType = async () => {
	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
		signatureVersion: "v4",
	});

	const params = {
		attributes: {
			DefaultSMSType: "Transactional",
			//'DefaultSMSType': 'Promotional' /* lowest cost */
		},
	};

	const setSMSTypePromise = new AWS.SNS({ apiVersion: "2010-03-31" }).setSMSAttributes(params).promise();

	setSMSTypePromise
		.then(function (data) {
			console.log(data);
		})
		.catch(function (err) {
			console.error(err, err.stack);
		});
};