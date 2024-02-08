import { Router } from "express";
import UserController from "../../controllers/user.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({ passError: true, statusCode: 400 });
const router = Router();

router.get("/test", UserController.test);

router.post("/user_signup", validator.body(Validation.createUser), UserController.userSignup);

router.post("/user_login", validator.body(Validation.userLogin), UserController.userLogin);

router.post("/social_login", validator.body(Validation.socialLogin), UserController.userSocialLogin);

router.post("/confirm_email", UserController.confirmEmail);

router.post("/forget_password", UserController.forgetPassword);

router.post("/send_otp", UserController.sendOtp);

router.post("/verify_otp", UserController.verifyOtp);

router.post("/reset_password", validator.body(Validation.resetPassword), UserController.resetPassword);

router.post("/resend_confirmation_email", UserController.verifyToken, UserController.resendConfirmationMail);

router.post("/change_password", UserController.verifyToken, UserController.changePassword);

router.post("/edit_user", UserController.verifyToken, UserController.editUser);

router.post("/view_user", UserController.verifyToken, UserController.viewUser);

router.post("/logout", UserController.verifyToken, UserController.logout);

router.post("/user_list", UserController.verifyToken, UserController.getManyUser);

export default router;
