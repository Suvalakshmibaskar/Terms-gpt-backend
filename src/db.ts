import mongoose, { ConnectOptions } from "mongoose";

const connectDB = () => {
	// Connect to DB
	const connectionOptions: ConnectOptions = {
		// useNewUrlParser: true,
		connectTimeoutMS: 300000, // 5 minutes
		// keepAlive: 120,
		// ha: true, // Make sure the high availability checks are on
		// haInterval: 10000, // Run every 10 seconds
		// useFindAndModify: false,
		// useUnifiedTopology: true,
		// useCreateIndex: true
	};
	//mongoose.set('debug', true);
	mongoose.connect(process.env.DB, connectionOptions, function (err) {
		if (err) console.log(err);
	});
	mongoose.connection.on("connecting", function () {
		console.log("Connecting to MongoDB...");
	});
	mongoose.connection.on("connected", function () {
		console.log("MongoDB connected!");
	});
	mongoose.connection.on("open", function () {
		console.log("MongoDB connection opened!");
	});
	mongoose.connection.on("error", function (err) {
		console.log(err);
		mongoose.disconnect();
	});
	mongoose.connection.on("disconnected", function () {
		console.log("MongoDB disconnected!");
		mongoose.connect(process.env.DB, connectionOptions, function (err) {
			if (err) console.log(err);
		});
	});
	mongoose.connection.on("reconnected", function () {
		console.log("MongoDB reconnected!");
	});
	mongoose.connection.on("close", function () {
		console.log("MongoDB closed");
	});
};

export default connectDB;
