process.env.NODE_ENV = "test";
import User from "../src/models/user.model";
import mongoose from "mongoose";
import toBeType from "jest-tobetype";
import request from "supertest";
import app from "../src/app";
import { IUser } from "../src/helpers/interface.helper";

expect.extend(toBeType);

let token;

afterAll(async () => {
	await User.deleteMany({});
	await mongoose.disconnect();
});

describe("User Auth", () => {
	test("User signup", async () => {
		const body = {
			email: "kishore1@yopmail.com",
			password: "qwertyuiop",
		};
		const response = await request(app).post("/api/v1/auth/user_signup").send(body);
		expect(response.statusCode).toBe(200);
	});
	test("User login", async () => {
		const body = {
			email: "kishore1@yopmail.com",
			password: "qwertyuiop",
		};
		const response = await request(app).post("/api/v1/auth/user_login").send(body);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(typeof response.body.token).toBe("string");
		token = response.body.token;
	});

	test("Social signup", async () => {
		const body = {
			email: "kishore@yopmail.com",
			social_account_type: "google",
		};
		const response = await request(app).post("/api/v1/auth/social_login").send(body);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body.message).toBe("User Created Successfully");
	});

	test("Social login", async () => {
		const body = {
			email: "kishore@yopmail.com",
			social_account_type: "google",
		};
		const response = await request(app).post("/api/v1/auth/social_login").send(body);
		expect(response.body).toHaveProperty("token");
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe("User Exist");
	});

	test("Forget password", async () => {
		const body = {
			email: "kishore1@yopmail.com",
		};
		const response = await request(app).post("/api/v1/auth/forget_password").send(body);
		expect(response.statusCode).toBe(200);
	});

	test("Reset password", async () => {
		const user: IUser = await User.findOne({ email: "kishore1@yopmail.com" });
		const body = {
			reset_password_hash: user.reset_password_hash,
			password: "1234567890",
		};
		const response = await request(app).post("/api/v1/auth/reset_password").send(body);
		expect(response.statusCode).toBe(200);
	});

	test("Resend Confirmation Mail", async () => {
		const response = await request(app).post("/api/v1/auth/resend_confirmation_email").set("authorization", token).send();
		expect(response.statusCode).toBe(200);
	});

	test("Change password", async () => {
		const body = {
			old_password: "1234567890",
			password: "qwertyuiop",
		};
		const response = await request(app).post("/api/v1/auth/change_password").set("authorization", token).send(body);
		expect(response.statusCode).toBe(200);
	});

	test("View User", async () => {
		const response = await request(app).post("/api/v1/auth/view_user").set("authorization", token).send();
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("data");
		expect(typeof response.body.data).toBe("object");
		expect(response.body.data).toHaveProperty("_id");
	});

	test("Edit User", async () => {
		const body = {
			first_name: "kishore",
		};
		const response = await request(app).post("/api/v1/auth/edit_user").set("authorization", token).send(body);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("data");
		expect(typeof response.body.data).toBe("object");
		expect(response.body.data.first_name).toBe(body.first_name);
	});

	test("Logout", async () => {
		const response = await request(app).post("/api/v1/auth/logout").set("authorization", token).send();
		expect(response.statusCode).toBe(200);
	});
});
