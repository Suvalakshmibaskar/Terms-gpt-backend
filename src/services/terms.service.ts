import Terms from "../models/terms.model";
import {
  ICreateTerms,
  ITerms,
  IPopulatedTerms,
  IEditTerms,
  IQueryTerms,
  IMongooseUpdate,
  IPaginationTerms,
  IPaginationOption,
} from "../helpers/interface.helper";
import pdf from "pdf-parse";
import fs from "fs";
import { uploadPromise } from "../helpers/s3.helper";
import multer from "multer";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import WordExtractor from "word-extractor";

const upload = multer({ dest: "uploads/" });
const extractor = new WordExtractor();

const TermsService = {
  createTerms: async (body: ICreateTerms): Promise<ITerms> => {
    const terms = await Terms.create(body);
    const data: ITerms = await Terms.findOne({ _id: terms._id }).lean();
    // if(_.isEmpty(terms)){
    //   return false;
    // }
    // return true;
    if (data) {
      data._id = data._id.toString();
    }
    return data;
  },
  getTerms: async (query: IQueryTerms): Promise<ITerms> => {
    query.is_deleted = false;
    const terms: ITerms = await Terms.findOne(query).lean();
    return terms;
  },
  getManyTerms: async (query: IQueryTerms): Promise<ITerms[]> => {
    query.is_deleted = false;
    const termss: ITerms[] = await Terms.find(query).lean();
    return termss;
  },
  getManyTermsWithPagination: async (query: IQueryTerms, options: IPaginationOption): Promise<IPaginationTerms> => {
    query.is_deleted = false;
    const totalDocs = await Terms.find(query).count();
    const termss: IPopulatedTerms[] = await Terms.find(query).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationTerms = {
      docs: termss,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editTerms: async (query: IQueryTerms, body: IEditTerms): Promise<boolean> => {
    const terms = await Terms.updateOne(query, { $set: body });
    if (terms.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteTerms: async (query: IQueryTerms): Promise<boolean> => {
    const terms = await Terms.updateOne(query, { $set: { is_deleted: true } });
    if (terms.modifiedCount === 0) {
      return false;
    }
    return true;
  },

  getUrl: async (query: any) => {
    try {
      let file_name = query.files.file.name;
      let upload_path = "src/assets/" + file_name;
      let file_dir = "src/assets";

      if (!fs.existsSync(file_dir)) {
        await fs.mkdirSync(file_dir, { recursive: true });
      }

      await query.files.file.mv(upload_path);

      const textData = await pdf(upload_path);

      await fs.unlink(upload_path, err => {
        if (err) console.log("fs unlink err", err);
      });
      return textData;
    } catch (error) {
      console.log("error", error);
    }
  },

  uploadFiles: async files => {
    if (!Array.isArray(files)) {
      files = [files];
    }
    // create a promise for upload multiple files
    let promiseToRun = [];
    for (let i = 0; i < files.length; i++) {
      promiseToRun.push(await TermsService.uploadToS3(files[i]));
    }
    let url = await Promise.all(promiseToRun);
    return url;
  },

  uploadToS3: async File => {
    try {
      let file_name = Date.now() + File.name.replace(/\s/g, "");
      let upload_path = "assets/images/" + file_name;
      let file_dir = "assets/images";

      if (!fs.existsSync(file_dir)) {
        await fs.mkdirSync(file_dir, { recursive: true });
      }

      //upload file into local assets
      await File.mv(upload_path);

      // S3 request
      let uploaded = await uploadPromise(upload_path, file_name);
      console.log("uploaded", uploaded);
      // unlink local file
      await fs.unlink(upload_path, err => {
        if (err) console.log("fs unlink err", err);
      });
      return uploaded.Location;
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  getTextFromImage: async (query: any) => {
    console.log("query.files", query.files);
    try {
      let file_name = query.files.file.name;
      let upload_path = "src/assets/" + file_name;
      let file_dir = "src/assets";
      if (!fs.existsSync(file_dir)) {
        await fs.mkdirSync(file_dir, { recursive: true });
      }
      await query.files.file.mv(upload_path);
      const textData = await Tesseract.recognize(upload_path);
      fs.unlink(upload_path, err => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      return textData.data.text;
    } catch (error) {
      console.log("error", error);
    }
  },

  getTextFromDoc: async (query: any) => {
    try {
      let file_name = query.files.file.name;
      let upload_path = "src/assets/" + file_name;
      let file_dir = "src/assets";
      if (!fs.existsSync(file_dir)) {
        await fs.mkdirSync(file_dir, { recursive: true });
      }
      await query.files.file.mv(upload_path);
      console.log("upload_path", upload_path);
      const textData = await extractor.extract(upload_path);
      console.log("textData", textData);
      fs.unlink(upload_path, err => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      return textData;
    } catch (error) {
      console.log("error", error);
    }
  },
};

export default TermsService;
