import Joi from "joi";

export const createUser = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/[0-9]{10}/)
    .optional(),
  password: Joi.string().required(),
  role: Joi.string().optional(),
});

export const editUser = Joi.object({
  phone: Joi.string()
    .regex(/[0-9]{10}/)
    .optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  username: Joi.string().optional(),
  id: Joi.string().required(),
});

export const userLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const socialLogin = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  username: Joi.string().optional(),
  email: Joi.string().email().required(),
  social_account_type: Joi.string().required(),
});

export const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const resetPassword = Joi.object({
  reset_password_hash: Joi.string().required(),
  password: Joi.string().required(),
});

export const createTerms = Joi.object({
  terms: Joi.string().optional(),
  user: Joi.string().optional(),
  summary: Joi.array().optional(),
  summary_prompt: Joi.string().optional(),
  problem: Joi.array().optional(),
  problem_prompt: Joi.string().optional(),
});

export const editTerms = Joi.object({
  terms_id: Joi.string().required(),
  update: Joi.object().optional(),
});

export const deleteTerms = Joi.object({
  terms_id: Joi.string().required(),
});
