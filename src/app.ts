import express from "express";
import http from "http";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import Logger from "./helpers/logger.helper";
import connectDB from "./db";
import { initAWS } from "./helpers/s3.helper";
import initSocketIO from "./helpers/socket.helper";
import { setSMSType } from "./helpers/sms.helper";
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import userRoute from "./routes/v1/user.route";
import { initTestQueue, testQueue } from "./schedulers/test.scheduler";
import TermsRoute from "./routes/v1/terms.route";
//_NR_

// create server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

function assignId(req, res, next) {
  req.id = nanoid(10);
  next();
}

// config dotenv
dotenv.config();

app.use(assignId);

//Init logger
Logger(app);

//Init AWS
initAWS();

//Set SMS Type
setSMSType();

//InitSocketServer
initSocketIO(io);

//Init scheduler
initTestQueue();
//bull adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(testQueue)],
  serverAdapter: serverAdapter,
});

// connect mongoose
if (process.env.NODE_ENV === "test") {
  process.env.DB = process.env.TEST_DB;
}
connectDB();

app.set("view engine", "ejs");

//BodyParser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.text({ type: "/" }));

// set mongoose as global
mongoose.Promise = global.Promise;

//To enable Cross-Origin Resource Sharing
let domain = "*";
if (process.env.NODE_ENV === "dev") {
  domain = "*";
}
app.use(
  cors({
    origin: domain,
  })
);

// fileUpload
app.use(fileUpload());

// routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/terms", TermsRoute);
//_NRD_

//Error Handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV === "production") {
    res.status(500).send({ desc: err.desc || "Something Went Wrong" });
    console.error(err);
  } else {
    console.error(err);
    res.status(500).send({ desc: err.desc, stack: err.stack, message: err.message });
  }
});

export default server;
