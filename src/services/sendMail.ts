import { envConfig } from "./../config/config";
import nodemailer from "nodemailer";
interface IData {
  to: string;
  subject: string;
  text: string;
}

const sendMail = async (data: IData) => {
  const transporter = nodemailer.createTransport({
    // kun platform lai pathauni like gmail,outlook,hotmail etc
    service: "gmail",
    // kun gmail bata mail pathauni
    auth: {
      user: envConfig.email,
      // app password// mail pass garna ko lag matri
      pass: envConfig.e_password,
    },
  });
  const mailOption = {
    from: "E-Dokan<asbingamer@gmail.com>",
    to: data.to,
    subject: data.subject,
    text: data.text,
  };
  try {
  await transporter.sendMail(mailOption);
    
  } catch (error) {
    console.log(error)
    
  }
};
export default sendMail
