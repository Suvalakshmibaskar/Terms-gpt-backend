import CryptoJS from "crypto-js";

const encrypt = (text: string) => {
	const secret: string = process.env.SECRET;
	const ciphertext = CryptoJS.AES.encrypt(text, secret).toString();
	return ciphertext;
};

const decrypt = (text: string) => {
	const secret: string = process.env.SECRET;
	const ciphertext = CryptoJS.AES.decrypt(text, secret);
	const originalText = ciphertext.toString(CryptoJS.enc.Utf8);
	return originalText;
};

export default { encrypt, decrypt };
