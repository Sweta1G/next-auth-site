/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email,emailType,userId} : any) =>{
    try{

        const hashedToken= await bcryptjs.hash(userId.toString(),10);

        if(emailType=="VERIFY"){
            await User.findByIdAndUpdate(userId,
                {$set: {verifyToken: hashedToken,
                // {verifyToken: hashedToken,
                verifyTokenExpiry: Date.now()+3600000}
            // )
            })

        console.log("Verification Section");
        const updatedUser= await User.findByIdAndUpdate(
          userId,{
            $set:{
              verifyToken: hashedToken,
              verifyTokenExpiry: new Date(Date.now())
            }
          });
          console.log("Updated User for Verify",updatedUser);


        }else if(emailType=="RESET"){
            await User.findByIdAndUpdate(userId,
                {$set: {forgotPasswordToken: hashedToken, 
                // {forgotPasswordToken: hashedToken, 
                forgotPasswordTokenExpiry: new Date(Date.now() + 3500000)}
                // forgotPasswordTokenExpiry: Date.now() + 3600000}
              // )
              })
        }
        // console.log("out of if else")

        const transport= nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "bae8d00a228089",
              pass: "8911c74cb052c2",

              // TODO: add these credentials to .env file
            }
          });

          const mailOptions ={
            from: 'sweta@sweta.ai', 
            to: email, 
            subject: emailType=== 'VERIFY'? "Verify your Email" : "Reset your Password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY"? "verify your email" : "reset your password"}
            or copy and paste the link below your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
          }
          const mailResponse = await transport.sendMail
          (mailOptions)
          return mailResponse
    }
    catch(error : any){
        throw new Error(error.message);
    }
}