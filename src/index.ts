import app from "./app";
const port = 9000;

app.listen(process.env.PORT || port, () => {
	console.log("server is listening on port", process.env.PORT || port);
});
