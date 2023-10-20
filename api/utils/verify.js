import nodemailer from 'nodemailer';

const verifyEmail = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_APP_EMAIL,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.GMAIL_APP_EMAIL,
      to: email,
      subject: 'Account Verification',
      text: 'Welcome,',
      html: `
      <div>
      <h2>Welcome to J.re Properties!</h2> <br /><br />
      <p>Please click the link below to verify your account:</p><br />
      <p><a href=${link}>Click here to verify your e-mail.</a></p>

      <br /><br />
      <p>Thanks, </p><br />
      J.re Properties <br />
      <br />
      <img src='https://firebasestorage.googleapis.com/v0/b/jp-estate.appspot.com/o/contents%2Flogo_header.png?alt=media&token=24bd2f23-c6c6-4e97-baad-8e5e78d80445&_gl=1*pf1g4j*_ga*MTM1Nzk3ODk0NC4xNjk3MjQ3ODM3*_ga_CW55HF8NVT*MTY5NzU2Njk1My4yNC4xLjE2OTc1NjY5NjAuNTMuMC4w' width="180" />
      </div>
      `,
    });
    console.log('mail sent successfully!');
  } catch (error) {
    console.log(error);
  }
};

export default verifyEmail;
