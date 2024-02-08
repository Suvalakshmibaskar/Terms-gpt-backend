const USER = {
	SOCIAL: "social",
	GOOGLE: "google",
	FACEBOOK: "facebook",
	RESET_PASSWORD: "Reset Your Password",
	FORGET_PASSWORD: "Forget Password",
};

export enum ROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ORG_ADMIN = "ORG_ADMIN",
}

export enum API_TYPE {
  USER = "USER",
  ORG = "ORG",
}

export enum ACTION_TYPE {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export const USER_HIDDEN_FIELDS = {
	password: 0,
};

export default USER;
