import fs from "fs";
import * as AWS from "aws-sdk";
import { checkURL } from "../helpers/functions.helper";
import request from "request";

let BUCKET_NAME;
let s3;
export const initAWS = () => {
	BUCKET_NAME = process.env.AWS_BUCKET_NAME;

	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION, // Must be the same as your bucket
		signatureVersion: "v4",
		// ACL: "public-read",
	});
	s3 = new AWS.S3();
};
// Initializing S3 Interface

export const download = (url, path, callback) => {
	request.head(url, () => {
		request(url).pipe(fs.createWriteStream(path)).on("close", callback);
	});
};

export const migrateImageToS3 = url => {
	return new Promise((resolve, reject) => {
		const filename = Date.now() + ".jpg";
		const localPath = "assets/images/" + filename;
		download(url, localPath, async () => {
			console.log("✅ Done!");
			const cb = uploadFile(localPath, filename);
			if (cb) {
				resolve(location);
				fs.unlink(localPath, err => {
					if (err) throw err;
					console.log(`successfully deleted ${localPath}`);
				});
			} else {
				reject();
			}
		});
	});
};

export const uploadFile = async (file: string, name: string) => {
	try {
		// read content from the file
		const fileContent = fs.readFileSync(file);
		const fileType = file.split(".").pop();
		const fileName = name;
		// setting up s3 upload parameters
		const params = {
			Bucket: BUCKET_NAME,
			Key: fileName, // file name you want to save as
			Body: fileContent,
			ContentType: checkURL(file) + "/" + fileType,
		};
		const data = await s3.upload(params).promise();
		return data;
	} catch (err) {
		console.log("upload err", err);
		return err;
	}
};

export const deleteFile = async (url: string) => {
	try {
		const name = url.split("/").pop();
		// setting up s3 upload parameters
		const params = {
			Bucket: BUCKET_NAME,
			Key: name, // file name you want to save as
		};

		// Uploading files to the bucket
		const res = await s3.deleteObject(params).promise();
		return res;
	} catch (err) {
		console.log("delete err", err);
		return err;
	}
};

export const signS3 = (req, res) => {
	const fileName = Date.now() + req.body["file_name"].replace(/\s/g, "");
	const fileType = req.body["file_type"];
	const s3Params = {
		Bucket: BUCKET_NAME,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: "public-read",
	};
	console.log(s3Params);
	s3.getSignedUrl("putObject", s3Params, (err, data) => {
		if (err) {
			console.log(err);
			return res.end();
		}
		const returnData = {
			signedRequest: data,
			url: `https://${BUCKET_NAME}.s3-accelerate.amazonaws.com/${fileName}`,
		};
		// res.write(JSON.stringify(returnData));
		// res.end();
		res.send(returnData);
	});
};

export const getPresignedUrl = (file: string) => {
	return new Promise((resolve, reject) => {
		// read content from the file
		const name = file.split("/").pop();
		console.log(name);
		const signedUrlExpireSeconds = 60 * 60;

		// setting up s3 upload parameters
		const params = {
			Bucket: BUCKET_NAME,
			Key: name, // file name you want to save as
			Expires: signedUrlExpireSeconds,
		};

		s3.getSignedUrl("getObject", params, function (err, data) {
			if (err) {
				console.log(err);
				reject(err);
			}
			console.log(`File uploaded successfully. ${data}`);
			resolve(data);
		});
	});
};

export const uploadPromise = async(file, name) => {
    try {
      // read content from the file
      const fileContent = fs.readFileSync(file);
      const fileType = file.split('.').pop();
      const fileName = "s3/" + name
      // setting up s3 upload parameters
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // file name you want to save as
        Body: fileContent,
        ContentType: checkURL(file) + "/" + fileType
      };
      let data = await s3.upload(params).promise();
      return data;
    } catch(err) {
      console.log(err);
      return err;
    }
  
  }
