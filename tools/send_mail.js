require('dotenv').config();
var fs = require('fs')

const nodemailer = require('nodemailer');

module.exports={
    send_mail : (user,text,HTMLmessage)=>{
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
            to: user,
            subject: 'Blanche Birger Madagascar | CONTRAT DE MAINTENANCE',
            text: text,
            html: HTMLmessage
        };
    
        // Step 3
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                if(err.command === "CONN") return console.log("vous n'avez pas de connexion internet pour l'envoie email");
                console.log("Error occurs!", err);
            }
            console.log("Email sent !")    
        });
    }
}