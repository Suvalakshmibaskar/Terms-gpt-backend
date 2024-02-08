import { ACTION_TYPE, API_TYPE, ROLE } from "../constants/user.constant";
import HTTP from "http-status-codes";
import { USER_RESPONSE } from "../constants/response.constant";

const { CREATE, READ, UPDATE, DELETE } = ACTION_TYPE;

const AccessList = {
	[ROLE.SUPER_ADMIN]: {
		[API_TYPE.USER]: [CREATE, READ, UPDATE, DELETE],
		[API_TYPE.ORG]: [CREATE, READ, UPDATE, DELETE],
	},
	[ROLE.ORG_ADMIN]: {
		[API_TYPE.USER]: [CREATE, READ, UPDATE, DELETE],
		[API_TYPE.ORG]: [CREATE, READ, UPDATE, DELETE],
	}
};

export const AccessControl = (apiType, actionType) => {
	return function (req, res, next) {
		let isAuthorised = false;
		req.decoded.role.forEach(role => {
			if (AccessList[role][apiType]) {
				if (AccessList[role][apiType].includes(actionType)) {
					isAuthorised = true;
				}
			}
		});
		if(!isAuthorised) {
			return res.status(HTTP.UNAUTHORIZED).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.UNAUTHORIZED });
		} else {
			next();
		}
	};
};
