/** @format */

let API = process.env.REACT_APP_API_KEY;

export const endpoints = {
	sendAttachmentMails: `${API}/mailer/sendDirectMail`,
	loginAPI: `${API}/user/login`,
	MenuUrlsAPI: `${API}/user/fetchMenuUrls`,
};
