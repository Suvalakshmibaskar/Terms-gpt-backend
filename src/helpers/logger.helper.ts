/* eslint-disable @typescript-eslint/ban-ts-comment */
import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import morganBody from "morgan-body";

function Logger(app) {
	const loggerStream = {
		write: message => {
			console.log(message);
		},
	};

	morganBody(app, {
		// @ts-expect-error 
		stream: loggerStream,
		logRequestId: true,
		filterParameters: ["password"],
	});
	if (process.env.NODE_ENV === "production") {
		winston.add(
			new WinstonCloudWatch({
				// @ts-expect-error
				awsConfig: {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
					region: process.env.AWS_REGION,
				},
				logGroupName: process.env.LOG_GROUP_NAME,
				logStreamName: process.env.LOG_STREAM_NAME,
			})
		);
	}
	const _log = console.log;
	const _error = console.error;

	console.error = function (log) {
		if (process.env.NODE_ENV === "production") {
			winston.error(log);
		}
		// eslint-disable-next-line prefer-rest-params
		_error.apply(console, arguments);
	};

	console.log = function (log) {
		if (process.env.NODE_ENV === "production") {
			winston.log(log);
		}
		// eslint-disable-next-line prefer-rest-params
		_log.apply(console, arguments);
	};
}

export default Logger;
