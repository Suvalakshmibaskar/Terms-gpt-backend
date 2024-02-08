import express from "express";
import UserController from "../../controllers/user.controller";
import TermsController from "../../controllers/terms.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();
import { signS3 } from "../../helpers/s3.helper";
import multer from "multer";
import userController from "../../controllers/user.controller";
const upload = multer({ dest: "uploads/" });

router.post("/create_terms", validator.body(Validation.createTerms), UserController.verifyToken, TermsController.createTerms);

router.post("/get_terms", UserController.verifyToken, TermsController.getTerms);

router.post("/get_many_terms", UserController.verifyToken, TermsController.getManyTerms);

router.post("/edit_terms", validator.body(Validation.editTerms), UserController.verifyToken, TermsController.editTerms);

router.post("/delete_terms", validator.body(Validation.deleteTerms), UserController.verifyToken, TermsController.deleteTerms);

router.post("/get_summary", UserController.verifyToken, TermsController.getSummaryAndProblems);

router.post("/get_summary_from_pdf", UserController.verifyToken, TermsController.getSummaryFromPdf);

router.post("/get_text_from_pdf", UserController.verifyToken, TermsController.getTextFromPdf);

router.post("/upload_file", UserController.verifyToken, signS3);

router.post("/get_text_from_image", UserController.verifyToken, upload.single("image"), TermsController.getTextFromImage);

router.post("/get_parsed_text", UserController.verifyToken, TermsController.getTextFromDoc);

router.post("/get_rephrase_terms", UserController.verifyToken, TermsController.getRePhraseTerms);

export default router;
