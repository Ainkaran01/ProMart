import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    // ✅ Validate inputs
    if (!to || !subject || !text) {
      throw new Error("Missing required email parameters");
    }

    // ✅ Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Email credentials not configured in environment variables");
      throw new Error("Email service not configured properly");
    }

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Using email: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");

    const mailOptions = {
      from: `"ProMart" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px;">ProMart</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Business Directory</p>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">${subject}</h2>
            <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea;">
              ${text.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #666; margin-top: 20px;">
              Best regards,<br>
              <strong>The ProMart Team</strong>
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${to}`);
    console.log(`✅ Message ID: ${result.messageId}`);
    
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      console.error("❌ Authentication failed - check email credentials");
    } else if (error.code === 'EENVELOPE') {
      console.error("❌ Invalid email address");
    } else if (error.code === 'ECONNECTION') {
      console.error("❌ Connection failed - check internet connection");
    }
    
    throw error; // Re-throw to handle in calling function
  }
};

export default sendEmail;