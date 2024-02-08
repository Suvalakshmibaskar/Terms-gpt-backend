import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model";
import Session from "../models/session.model";

import Mail from "../helpers/ses.helper";
import { USER_RESPONSE } from "../constants/response.constant";
import { EMAIL, EMAIL_TEMPLATES } from "../constants/email.constant";
import * as s3 from "../helpers/s3.helper";

import {
	IUser,
	IUserArray,
	ISession,
	ISessionArray,
	ISessionUpdate,
	IUserQuery,
	ISocialLogin,
	IUserListQuery,
	IPaginationOption,
	IUserList,
	IUpdateUser,
} from "../helpers/interface.helper";
import USER, { USER_HIDDEN_FIELDS } from "../constants/user.constant";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface IToken {
  accessToken?: string;
  idToken?: string;
}

const UserService = {
	test: async () => {
		console.time("test");

		// await UserService.createSession({ user: new mongoose.Types.ObjectId() })
		console.timeEnd("test");
	},

	userDetails: async (id?: string, email?: string): Promise<IUser> => {
		const query: IUserQuery = {};
		if (id) {
			query._id = id;
		}
		if (email) {
			query.email = email;
		}
		const user: IUser = await User.findOne(query, USER_HIDDEN_FIELDS, null).lean();
		if(user) {
			user._id = user._id.toString();
		}
		return user;
	},

	userDetailsWithPassword: async (id?: string, email?: string): Promise<IUser> => {
		const query: IUserQuery = {};
		if (id) {
			query._id = id;
		}
		if (email) {
			query.email = email;
		}
		const user: IUser = await User.findOne(query, null, null).lean();
		if(user) {
			user._id = user._id.toString();
		}
		return user;
	},

	updateUser: async (query: IUserQuery, update: IUpdateUser): Promise<boolean> => {
		const updatedUser = await User.updateOne(query, update).lean();
		if (updatedUser.modifiedCount === 0) {
			return false;
		}
		return true;
	},

	getMultipleUsers: async (query: IUser) => {
		const users = await User.find(query, USER_HIDDEN_FIELDS, null).lean();
		return users;
	},

	generateToken: async (id: string, email: string, role: string) => {
		const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
		let token = jwt.sign({ exp: expiry, data: { id: id, email: email, role: role } }, process.env.SECRET);
		token = "Bearer " + token;
		return token;
	},

	sendConfirmationMail: async (email: string) => {
		const user: IUser = await UserService.userDetails(undefined, email);

		//Send mail
		const id = new mongoose.Types.ObjectId();
		const html = await EMAIL_TEMPLATES.confirmEmail(user.first_name, id);
		const response = await Mail("", email, EMAIL.CONFIRM_EMAIL_SUBJECT, "", html);
		if (response) {
			const body = {
				email_confirmation_id: id,
			};
			const update = await User.updateOne({ email: email }, body);
			if (update.modifiedCount === 0) {
				return false;
			}
			return true;
		} else {
			return false;
		}
	},

	createUser: async (data: IUser): Promise<IUser> => {
		const user = await User.create(data);
		const userData: IUser = await User.findOne({_id: user._id}, USER_HIDDEN_FIELDS, null).lean();
		if(userData) {
			userData._id = userData._id.toString();
		}
		return userData;
	},

	getManyUser: async (query: IUserListQuery) => {
		query.is_deleted = false;
		const users: IUserArray = await User.find(query, USER_HIDDEN_FIELDS).lean();
		return users;
	},

	getManyUserWithPagination: async (query: IUserListQuery, options: IPaginationOption) => {
		const users: IUserArray = await User.find(query, USER_HIDDEN_FIELDS).skip(options.skip).limit(options.limit).lean();
		const totalDocs = await User.find(query).count();
		const result: IUserList = {
			docs: users,
			skip: options.skip,
			limit: options.limit,
			totalDocs,
		};
		return result;
	},

	getSingleUserByQuery: async (query: IUser) => {
		const user: IUser = await User.findOne(query, USER_HIDDEN_FIELDS, null).lean();
		if(user) {
			user._id = user._id.toString();
		}
		return user;
	},

	getUserCount: async (query: IUser) => {
		const count = await User.countDocuments(query).lean();
		return count;
	},

	getUserDetailsWithSession: async (query: IUser) => {
		const user = await User.findOne(query, null, null).lean();
		return user;
	},

	isUsernameExist: async (username: string): Promise<boolean> => {
		const count = await User.countDocuments({ username: username });
		if (count > 0) {
			return false;
		} else {
			return true;
		}
	},

	generateUsername: async (email: string): Promise<string> => {
		const split = email.split("@");
		let username = split[0];
		while (!(await UserService.isUsernameExist(username))) {
			const random = Math.floor(1000 + Math.random() * 9000);
			username = username + random.toString();
		}
		return username;
	},

	authenticateSocialLogin: async (platform: string, token: IToken, payload: ISocialLogin) => {
		if (platform === USER.GOOGLE) {
			const body = await UserService.authenticateGoogle();
			return body;
		} else if (platform === USER.FACEBOOK) {
			const body = await UserService.authenticateFB(token, payload);
			return body;
		}
	},

	authenticateGoogle: async () => {
		const ticket = await client.verifyIdToken({
			idToken: "AJOnW4TuZieS006tUqkB8Z-5PCDjz68AjouICdqy4UfhCdkCC4SySdgNRAgE2K3cf4m7jDl_Ucn5knbCzCW14caRyeClSN7OzAp8SvKIrEgPa2nk10AZVvriKScH4oT1LbSgsE0EdKyqXh1VFRUFYEjrJw7uGhRDICtTAB5JWq7wpaXkwhvvIY0LMckABH9ggveJE-Sl2iVI-SRoNsVpRNvHbir6VFP790gpySB_9Y8cyOgkqeDHxzA",//token.idToken,
			audience: "956891842797-k5haeiq52b25pik17rcplb6ha2j6sjvn.apps.googleusercontent.com"//process.env.GOOGLE_CLIENT_ID,
		});
		const payload = ticket.getPayload();
		console.log("payload", payload);
		const data = {
			name: payload.name,
			email: payload.email,
			confirmed: payload.email_verified,
			first_name: payload.given_name,
			last_name: payload.family_name,
			profile_picture: await s3.migrateImageToS3(payload.picture),
			username: await UserService.generateUsername(payload.email),
		};
		return data;
	},

	authenticateFB: async (token: IToken, payload) => {
		const response = await axios.get(`https://graph.facebook.com/${payload.id}?access_token=${token.accessToken}`);
		if (response.data.id === payload.id) {
			const data = {
				name: payload.name,
				email: payload.email,
				confirmed: true,
				first_name: payload.firstName,
				last_name: payload.lastName,
				profile_picture: await s3.migrateImageToS3(payload.profilePicURL),
				username: await UserService.generateUsername(payload.email),
			};
			return data;
		} else {
			throw new Error(USER_RESPONSE.FB_AUTH_FAILED);
		}
	},

	createSession: async (body): Promise<ISession> => {
		//Logout pervious session
		const previousSession: ISession = await Session.findOne({ user: body.user }, {}, { sort: { created_at: -1 } });
		if (previousSession && !previousSession.logout) {
			await UserService.updateSession({ _id: previousSession._id }, { logout: new Date() });
		}

		const session = await Session.create(body);
		const sessionData: ISession = await Session.findOne({ user: session.user }, {}, { sort: { created_at: -1 } });
		sessionData._id = sessionData._id.toString();
		return sessionData;
	},

	findSessions: async (user: string): Promise<ISessionArray> => {
		const session: ISessionArray = await Session.find({ user: user }).sort({ created_at: -1 }).lean();
		return session;
	},

	findSession: async (id: string, user: string): Promise<ISession> => {
		const query: ISession = {};
		if (id) {
			query._id = id;
		} else if (user) {
			query.user = user;
		}
		const session: ISession = await Session.findOne(query).sort({ created_at: -1 }).lean();
		return session;
	},

	updateSession: async (query: ISession, update: ISessionUpdate): Promise<boolean> => {
		const updatedSession = await Session.updateOne(query, update).lean();
		if (updatedSession.modifiedCount === 0) {
			throw new Error(USER_RESPONSE.SESSION_UPDATE_ERROR);
		}
		return true;
	},
};

export default UserService;
