import TermsService from "../services/terms.service";
import _ from "lodash";
import { STATUS, TERMS_RESPONSE, USER_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchTerms } from "../helpers/interface.helper";
import HTTP from "http-status-codes";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

const TermsController = {
  createTerms: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      // let getTerms = await TermsService.getTerms({});
      // if (getTerms) return res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: TERMS_RESPONSE.ALREADY_EXIST });
      const terms = await TermsService.createTerms(req.body);
      if (terms) {
        res.send({
          status: STATUS.SUCCESS,
          message: TERMS_RESPONSE.CREATE_SUCCESS,
          data: terms,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: TERMS_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = TERMS_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getTerms: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const terms = await TermsService.getTerms({ _id: req.body.terms_id });
      if (!_.isEmpty(terms)) {
        res.send({ status: STATUS.SUCCESS, message: TERMS_RESPONSE.GET_SUCCESS, data: terms });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: TERMS_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = TERMS_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManyTerms: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchTerms = { user: req.decoded.id };
      const maxStringLength = 40;
      const regex = new RegExp(`^.{0,${maxStringLength}}${search}`, "i");

      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ terms: { $regex: regex } }],
        };
      }
      const termss = await TermsService.getManyTermsWithPagination(query, { skip, limit, sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: TERMS_RESPONSE.GET_MANY_SUCCESS,
        data: termss,
      });
    } catch (err) {
      err.description = TERMS_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editTerms: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const editedTerms = await TermsService.editTerms({ _id: req.body.terms_id }, req.body.update);
      if (editedTerms) {
        const query = {
          _id: req.body.terms_id,
        };
        const terms = await TermsService.getTerms(query);
        res.send({
          status: STATUS.SUCCESS,
          message: TERMS_RESPONSE.EDIT_SUCCESS,
          data: terms,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: TERMS_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = TERMS_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  deleteTerms: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteTerms = await TermsService.deleteTerms({ _id: req.body.terms_id });
      if (deleteTerms) {
        res.send({
          status: STATUS.SUCCESS,
          message: TERMS_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: TERMS_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = TERMS_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
  getRePhraseTerms: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const openai = new OpenAIApi(configuration);
      let prompt: string = "Rephrase the given sentence in list of different ways sentences";
      const getRePhraseTerms = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${req.body.content.replace(/[\r\n]+/gm, "")}\nQ: ${prompt}\nA:` }],
        temperature: 0,
        max_tokens: 500,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      res.send({
        status: STATUS.SUCCESS,
        message: USER_RESPONSE.GET_REPHRASE_TERMS,
        data: getRePhraseTerms.data.choices[0].message.content.split("\n"),
      });
    } catch (error) {
      if (error.response) {
        console.error("Status code:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received");
      } else {
        console.error("Error message:", error.message);
      }
    }
  },
  getSummaryAndProblems: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const openai = new OpenAIApi(configuration);
      const summary_prompt = "Please provide a detailed one-line list for each terms and conditions";
      const problems_prompt = "Generate a list of common problems or challenges that people might face here";
      const summary = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${req.body.terms.replace(/[\r\n]+/gm, "")}\nQ: ${summary_prompt}\nA:` }],
        temperature: 0,
        max_tokens: 500,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const problems = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `${req.body.terms.replace(/[\r\n]+/gm, "")}\nQ: ${problems_prompt}\nA:`,
          },
        ],
        temperature: 0,
        max_tokens: 500,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      let createTerms = await TermsService.createTerms({
        terms: req.body.terms,
        user: req.decoded.id,
        summary: summary.data.choices[0].message.content.split("\n"),
        summary_prompt: summary_prompt,
        problem: problems.data.choices[0].message.content.split("\n"),
        problem_prompt: problems_prompt,
      });

      res.send({
        status: STATUS.SUCCESS,
        message: USER_RESPONSE.GET_SUMMARY_AND_PROBLEMS,
        data: createTerms,
      });
    } catch (error) {
      console.log("error" + error);
    }
  },

  getTextFromPdf: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const textData = await TermsService.getUrl(req);
      res.send({
        status: STATUS.SUCCESS,
        data: { text: textData.text.replace(/[\r\n]+/gm, "") },
      });
    } catch (error) {}
  },

  getSummaryFromPdf: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const textData = await TermsService.getUrl(req);
      const openai = new OpenAIApi(configuration);
      const summary_prompt = "Please provide a detailed one-line gist for each terms and conditions";
      const problems_prompt = "Generate a list of common problems or challenges that people might face while trying to understand or comply here";

      const summary = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${textData.text.replace(/[\r\n]+/gm, "")}\nQ: ${summary_prompt}\nA:` }],
        temperature: 0,
        // max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const problems = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `${textData.text.replace(/[\r\n]+/gm, "")}\nQ: ${problems_prompt}\nA:`,
          },
        ],
        temperature: 0,
        // max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      TermsService.createTerms({
        terms: JSON.stringify(textData.text),
        user: req.decoded.id,
        summary: summary.data.choices[0].message.content.split("\n"),
        summary_prompt: summary_prompt,
        problem: problems.data.choices[0].message.content.split("\n"),
        problem_prompt: problems_prompt,
      });
      res.send({
        status: STATUS.SUCCESS,
        message: USER_RESPONSE.GET_SUMMARY_AND_PROBLEMS,
        data: {
          summary: summary.data.choices[0].message.content.split("\n"),
          problems: problems.data.choices[0].message.content.split("\n"),
          terms: JSON.stringify(textData.text),
        },
      });
    } catch (error) {
      console.log("error" + error);
    }
  },

  uploadMedia: async (req, res, next) => {
    try {
      if (req.files && req.files.file && req.files.file.length === 0) {
        res.status(422).send({ status: "failed", message: "No files were added!" });
      }
      const files = await TermsService.uploadFiles(req.files.file);
      if (files.includes(false)) {
        res.status(422).send({ status: "failed", message: "Failed to upload file" });
      } else {
        res.send({ status: "success", message: "Files uploaded successfully", data: files });
      }
    } catch (err) {
      err.desc = "Failed to upload file";
      next(err);
    }
  },

  getTextFromImage: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const textData = await TermsService.getTextFromImage(req);
      res.send({
        status: STATUS.SUCCESS,
        data: { text: textData },
      });
    } catch (error) {
      console.log("error", error);
    }
  },

  getTextFromDoc: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const textData = await TermsService.getTextFromDoc(req);
      res.send({
        status: STATUS.SUCCESS,
        data: { text: textData },
      });
    } catch (error) {
      console.log("error", error);
    }
  },
};

export default TermsController;
