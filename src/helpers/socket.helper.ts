import jwt from "jsonwebtoken";
import { USER_RESPONSE } from "../constants/response.constant";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initSocketIO = (io:any) => {
	const chatRooms = {}; //Don't use this to emit message
	let isAuthenticated = false;
	io.on("connection", socket => {
		// Socket Authentication
		if (socket.handshake.query && socket.handshake.query.token) {
			const token = socket.handshake.query.token.replace("Bearer ", "");
			jwt.verify(token, process.env.SECRET, function (error, decoded) {
				if (error) {
					console.log("error", error);
					isAuthenticated = false;
					return;
				}
				isAuthenticated = true;
				socket.decoded = decoded.data;
			});
		} else {
			socket.emit("exception", { errorMessage: USER_RESPONSE.TOKEN_ERROR });
		}

		if (!isAuthenticated) {
			socket.emit("exception", { errorMessage: USER_RESPONSE.TOKEN_ERROR });
		} else {
			socket.emit("connected", socket.id);
			console.log("socket connected & authenticated", socket.id);

			//Global socket to emit
			global.gSocket = socket;

			socket.on("join-chat", (data: { user: string }) => {
				chatRooms[data.user] = { socket: socket.id };
				socket.join(data.user);
				io.to(data.user).emit("user-connected", socket.id);
			});
		}
	});
};

export default initSocketIO;
