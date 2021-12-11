import nodemailer from "nodemailer";
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "tictac22314@gmail.com", // generated ethereal user
              pass: "markeloff22", // generated ethereal password
            },
        });
    }
    async sendActivationMail(email,name,link) {
        await this.transporter.sendMail({
            from: "Todo app",
            to: `${email}`, // list of receivers
            subject: "Activation your account", // Subject line
            text: `Fomins Artjoms`, // plain text body
            html: `<div>
                        <h1>Hello ${name},</h1>
                        <div>To activate your account go on this link:</div>
                        <br/>
                        <a target="_blank" href=${process.env.BASE_URL}/confirm${link}>Link To verify </a>
                    </div>`
        });    
    }
    async SendForgotPasswordEmail(email,link) {
        await this.transporter.sendMail({
            from: "Todo app",
            to: `${email}`, // list of receivers
            subject: "Password reset", // Subject line
            text: `Fomins Artjoms`, // plain text body
            html: `<div>
                        <div>This is email for creating new password</div>
                        <br/>
                        <a target="_blank" href=${link}>Link To for new password </a>
                    </div>`
        });   
    }
}

export default new MailService()