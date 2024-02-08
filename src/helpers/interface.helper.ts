import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";

export interface IRequest extends Request {
  decoded: IDecoded;
}

export type IResponse = Response;

export type INextFunction = NextFunction;

export interface IDecodedData {
  data: IDecoded;
}

export interface IDecoded {
  id: string;
  org: string;
  role: string;
  session_token: string;
}
export interface IUser {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  confirmed?: boolean;
  social_account_type?: string;
  email_confirmation_id?: string;
  first_name?: string;
  last_name?: string;
  reset_password_hash?: string;
  reset_password_expiry?: Date;
  session_id?: string;
  otp?: string;
  created_by?: string;
  phone?: string;
  profile_picture?: string;
  is_deleted?: boolean;
  created_at?: Date;
  modified_at?: Date;
  og_email?: string;
}

export interface IUpdateUser {
  username?: string;
  password?: string;
  role?: string;
  confirmed?: boolean;
  social_account_type?: string;
  email_confirmation_id?: string;
  first_name?: string;
  last_name?: string;
  reset_password_hash?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reset_password_expiry?: any;
  session_id?: string;
  otp?: string;
  phone?: string;
  profile_picture?: string;
  is_deleted?: boolean;
  created_at?: Date;
  modified_at?: Date;
}

export interface IUserList {
  docs?: Array<object>;
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  skip?: number;
}

export interface IUserListQuery {
  org: string;
  email?: object;
  is_deleted?: boolean;
}

export type IUserArray = IUser[];
export interface IUserQuery {
  _id?: string;
  email?: string;
  is_deleted?: boolean;
  role?: string;
  name?: string;
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  user_id?: string;
  user?: string;
  org?: string;
  email_confirmation_id?: string;
  $or?: Array<object>;
  $and?: Array<object>;
}

export interface ISession {
  _id?: string;
  user?: string;
  logout?: Date;
  login?: Date;
  created_at?: Date;
  modified_at?: Date;
}

export interface ISessionUpdate {
  user?: string;
  logout?: Date;
}

export type ISessionArray = ISession[];

export interface IPaginationResponse {
  totalDocs: number;
  skip: number;
  limit: number;
}

export interface IPushNotification {
  token: string;
  title: string;
  body: string;
  image?: string;
  isScheduled?: boolean;
  scheduledTime?: Date;
}
export interface INotification {
  _id?: string;
  user?: string;
  title?: string;
  body?: string;
  type?: string;
  redirect_to?: string;
  seen?: boolean;
  from?: string;
  merge_fields?: object;
  data?: object;
  is_deleted?: boolean;
  created_at?: string;
  modified_at?: string;
}

export interface IQueryNotification {
  _id?: string;
  user?: string;
  title?: string;
  body?: string;
  type?: string;
  redirect_to?: string;
  seen?: boolean;
  from?: string;
  merge_fields?: object;
  data?: object;
  is_deleted?: boolean;
  created_at?: string;
  modified_at?: string;
  $or?: Array<object>;
  $and?: Array<object>;
}

export interface IPaginationNotification extends IPaginationResponse {
  docs: INotification[];
}
export interface IGetNotification {
  _id?: string;
  user?: string;
  title?: string;
  body?: string;
  type?: string;
  redirect_to?: string;
  seen?: boolean;
  from?: string;
  is_deleted?: boolean;
  created_at?: string;
  modified_at?: string;
}

export interface ICreateNotification {
  user?: string;
  title?: string;
  body?: string;
  type?: string;
  redirect_to?: string;
  seen?: boolean;
  from?: string;
  merge_fields?: object;
  data?: object;
  category: string;
  message: string;
}

export interface IMongooseUpdate {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: ObjectId;
}

export interface IPaginationOption {
  skip: number;
  limit: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sort?: any;
}

export interface IWinston {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any;
}

export interface ISocialLogin {
  name: string;
  email: string;
  confirmed: boolean;
  first_name: string;
  last_name: string;
  profile_picture: string;
  username: string;
}
export interface ITerms {
  _id: string | Types.ObjectId;
    terms?: string;
user?: string;
  summary?: string;
  summary_prompt?: string;
  problem?: string;
  problem_prompt?: string;

}

export interface IPopulatedTerms {
  _id: string | Types.ObjectId;
    terms?: string;
user?: IUser;
  summary?: Array<string>;
  summary_prompt?: string;
  problem?: Array<string>;
  problem_prompt?: string;

}

export interface ICreateTerms {
    terms: string;
  user: string;
  summary?: Array<string>;
  summary_prompt?: string;
  problem?: Array<string>;
  problem_prompt?: string;

}
export interface IQueryTerms {
  _id?: string;
  is_deleted?: boolean;
    terms?: string;
  user?: string;
  summary?: Array<string>;
  summary_prompt?: string;
  problem?: Array<string>;
  problem_prompt?: string;

}
export interface IPaginationTerms extends IPaginationResponse {
  docs: IPopulatedTerms[];
}
export interface IEditTerms {
  _id: string;
    terms?: string;
  user?: IUser;
  summary?: Array<string>;
  summary_prompt?: string;
  problem?: Array<string>;
  problem_prompt?: string;

}
export interface IQuerySearchTerms {
  _id?: string;
  $or?: Array<object>;
  $and?: Array<object>
    terms?: string;
  user?: string;
  summary?: Array<string>;
  summary_prompt?: string;
  problem?: Array<string>;
  problem_prompt?: string;

}