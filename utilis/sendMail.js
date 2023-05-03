const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

//new Email(user,url).sendPasswordReset()
module.exports = class Email {
  constructor(user,url){
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Clement Owireku-Bogyah <${process.env.EMAIL_FROM}>`;
  }

 newTransport(){
    if(process.env.NODE_ENV === 'production'){
      //send grid transporter
      return 1;
    }else{
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    }
  }
  //send the actual email
  async send(template,subject){
    //1 render email HTML based on a pug template
    // /Users/clementbogyah/Desktop/file-server/views/email/welcome.pug
    const html = pug.renderFile(`/Users/clementbogyah/Desktop/file-server/views/email/welcome.pug`,{
      firstName: this.firstName,
      url:this.url,
      subject
    })
    //2 define email options
    const mailoptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),

    };

    // 3. create a transport and send email
    await this.newTransport().sendMail(mailoptions)
  }
  async sendWelcome(){
    await this.send('welcome','Welcome to IFILE!')
  }
}

