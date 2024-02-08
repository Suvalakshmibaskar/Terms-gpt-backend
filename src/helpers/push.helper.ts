import { IPushNotification } from "./interface.helper";

import FCM from "fcm-node";
let fcm;

const fcmInit = () => {
	fcm = new FCM(process.env.FIREBASE_SERVER_KEY);
};

const sendPushNotification = data => {
	return new Promise((resolve, reject) => {
		const message = {
			to: data.token,
			notification: {
				title: data.title,
				body: data.body,
				image: data.image,
			},
			apns: {
				payload: {
					aps: {
						"mutable-content": 1,
					},
				},
				fcm_options: {
					image: data.image,
				},
			},
		};

		fcm.send(message, function (err, response) {
			if (err) {
				console.log("Something has gone wrong!", err);
				reject(err);
			} else {
				console.log("Successfully sent with response: ", response);
				resolve(message);
			}
		});
	});
};

const pushNotification = (data: IPushNotification) => {
	const notification = {
		token: data.token,
		title: data.title,
		body: data.body,
		image: data.image,
		isScheduled: data.isScheduled,
		scheduledTime: data.scheduledTime,
	};
	sendPushNotification(notification);
};

module.exports = {
	pushNotification,
	sendPushNotification,
	fcmInit,
};
