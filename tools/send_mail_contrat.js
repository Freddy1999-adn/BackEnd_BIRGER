require('dotenv').config();
var fs = require('fs')

const nodemailer = require('nodemailer');

module.exports={
    send_mail : (users,pdf_path)=>{
        // Step 1
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            secure:false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD 
            }
        });
    
        // Step 3
        let mailOptions = {
            from: process.env.EMAIL,
            to: users,
            subject: 'Blanche Birger Madagascar',
            text: 'CONTRAT DE MAINTENANCE && CONTRAT DE GARANTIE ',
            attachments : {   // filename and content type is derived from path
                path: pdf_path
            },
        };
    
        // Step 3
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                if(err.code==="ESOCKET" && err.command === "CONN") return console.log("Vous n'avez pas de connexion internet !");
                return console.log("Error occurs!", err);
            }

            fs.unlink(pdf_path,(err)=>{
                if(err) return console.log(err);
                console.log('file deleted successfully');
           }); 

            return console.log("Email sent !");
        });
    }
}

// send_notification()