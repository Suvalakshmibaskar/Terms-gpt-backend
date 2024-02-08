
/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.NODE_ENV = "test";
import User from "../src/models/user.model";
import Terms from "../src/models/terms.model";
import mongoose from "mongoose";
import toBeType from "jest-tobetype";
import request from "supertest";
import app from "../src/app";

expect.extend(toBeType);

let token, termsId;

afterAll(async () => {
  await User.deleteMany({});
  await Terms.deleteMany({});
  await mongoose.disconnect();
});

describe("Terms Test", () => {
  test("User signup", async () => {
    const body = {
      email: "kishore@yopmail.com",
      password: "qazwsx12",
    };
    const response: any = await request(app).post("/api/v1/auth/user_signup").send(body);
    expect(response.statusCode).toBe(200);
  });
  test("User login", async () => {
    const body = {
      email: "kishore@yopmail.com",
      password: "qazwsx12",
    };
    const response: any = await request(app).post("/api/v1/auth/user_login").send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    token = response.body.token;
  });

  test("Create Terms", async () => {
    const body: any = {
      terms: "qwertyuiop",
user: "623980a44794ef59b9024c15",
summary: "qwertyuiop",
summary_prompt: "qwertyuiop",
problem: "qwertyuiop",
problem_prompt: "qwertyuiop",

    };
    const response: any = await request(app).post("/api/v1/terms/create_terms").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
    termsId = response.body.data._id;
  });

  test("Get Terms", async () => {
    const body: any = {
      terms_id: termsId
    };
    const response: any = await request(app).post("/api/v1/terms/get_terms").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
  });

  test("Get Many Terms", async () => {
    const body: any = {
      search: "qwertyuiop",
    };
    const response: any = await request(app).post("/api/v1/terms/get_many_terms").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data.docs).toBe("object");
    expect(response.body.data.docs[0]).toHaveProperty("_id");
  });

  test("Edit Terms", async () => {
    const body: any = {
      terms_id: termsId,
      
    };
    const response: any = await request(app).post("/api/v1/terms/edit_terms").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data.).toBe(body.);
  });

  test("Delete Terms", async () => {
    const body: any = {
      terms_id: termsId
    };
    const response: any = await request(app).post("/api/v1/terms/delete_terms").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
  });
});
