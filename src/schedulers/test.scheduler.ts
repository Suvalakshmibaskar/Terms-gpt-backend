import Queue from "bull";

let port;
export const initTestQueue = () => {
	port = parseInt(process.env.REDIS_PORT);
};

export const testQueue = new Queue("test-queue", {
	redis: { host: process.env.REDIS_HOST, port },
});

export const testSchedule = async () => {
	await testQueue.add({ name: "test" }, { delay: 3000 });
};

testQueue.process(async (job, done) => {
	console.log("job.data", job.data);
	done();
});
