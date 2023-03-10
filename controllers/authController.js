const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validate } = require("../requests/utilisateurRequest");
const { sendError, sendResponse } = require("./baseController");
const { PrismaClient } = require("@prisma/client");
const { utilisateur } = new PrismaClient();
const { send_mail } = require("../tools/send_mail");
//send mail for creating user, send password to the user
//password forgot send confirmation code

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const all_utilisateur = await utilisateur.findMany();
      sendResponse(res, all_utilisateur, "Liste des utilisateurs");
    } catch (error) {
      next(error);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const utilisateur_ = await utilisateur.findFirst({
        where: { id: +id },
      });

      sendResponse(res, utilisateur_, "Information utilisateur");
    } catch (error) {
      next(error);
    }
  },
  getByEmail: async (req, res, next) => {
    try {
      const { email } = req.params;
      const utilisateur_ = await utilisateur.findFirst({
        where: { email: email },
      });

      sendResponse(res, utilisateur_, "Information utilisateur");
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    // Request validation
    const { error } = validate(req.body);
    if (error) sendError(res, error.details[0].message);

    const { nom, pseudo, email, is_envoie_rappel, is_admin, tel, image_path } =
      req.body;

    const password = generatePassword();

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    if (is_admin) {
      try {
        const newUser = await utilisateur.create({
          data: {
            nom,
            pseudo,
            email,
            is_envoie_rappel,
            is_admin,
            tel,
            image_path,
            password: hashedPassword,
          },
        });

        delete newUser.password;
        if (newUser) {
          send_mail(
            email,
            "GESTION DE CONTRAT DE MAINTENANCE",
            `<p>Voici votre mot de passe pour vous connecter : <strong>${password}</strong> </p><br><p>Vous pouvez le modifier à tout moment !</p>`
          );
          message = `Utilisateur créer avec succès, le mot de passe est consultable via son adresse email : ${newUser.email}  !`;
          sendResponse(res, newUser, message);
        }
      } catch (error) {
        console.log("ERROR ", error);
        if (error.code === "P2002")
          return sendError(res, "L'utilisateur dispose déjà un compte");
        return sendError(res, error);
      }
    } else {
      //verifySuperAdminCount, should be less than 4 super Admin
      let superAdminCount = 0;
      try {
        const superAdminCount_ = await utilisateur.count({
          where: {
            is_admin: false,
          },
        });
        superAdminCount = superAdminCount_;
      } catch (error) {
        console.log(error);
      }

      if (superAdminCount < 3) {
        // Create new user
        try {
          const newUser = await utilisateur.create({
            data: {
              nom,
              pseudo,
              email,
              is_envoie_rappel,
              is_admin,
              tel,
              image_path,
              password: hashedPassword,
            },
          });

          delete newUser.password;
          if (newUser) {
            send_mail(
              email,
              "GESTION DE CONTRAT DE MAINTENANCE",
              `<p>Voici votre mot de passe pour vous connecter : <strong>${password}</strong> </p><br><p>Vous pouvez le modifier à tout moment !</p>`
            );
            message = `Utilisateur créer avec succès, le mot de passe est consultable via son adresse email : ${newUser.email}  !`;
            sendResponse(res, newUser, message);
          }
        } catch (error) {
          console.log("ERROR ", error);
          if (error.code === "P2002")
            return sendError(res, "L'utilisateur dispose déjà un compte");
          return sendError(res, error);
        }
      } else {
        sendError(res, "Le nombre de super admin est limité à 3 !");
      }
    }
  },
  login: async (req, res, next) => {
    // Request validation
    // const { error } = validate(req.body)
    // if(error) sendResponse(res, null, error.details[0].message)

    const { email, password } = req.body;
    if (!email || !password)
      sendError(res, "Veuillez remplir correctement le formulaire");
    else {
      // Check if the pseudo exists
      const user = await utilisateur.findUnique({
        where: { email },
      });

      if (!user) sendError(res, "Veuillez créer un compte pour vous connecter");
      else {
        // Check if the password correct
        bcrypt.compare(password, user.password, async (err, result) => {
          if (err) sendError(res, new Error(err));
          else if (result) {
            // Create and assign token

            // const access_token = jwt.sign(
            //   { email: user.email },
            //   process.env.ACCESS_TOKEN,
            //   // { expiresIn: "60s" }
            //   { expiresIn: "1d" }
            // );

            // res.header('auth-token', access_token)

            // Set cookie
            // res.cookie("auth_token", access_token, {
            //   httpOnly: true,
            //   sameSite: "None",
            //   secure: true,
            //   maxAge: 24 * 60 * 60 * 1000,
            // });

            sendResponse(res, user, `Bienvenue ${user.pseudo} !`);
          } else {
            sendError(res, "Mot de passe invalide");
          }
        });
      }
    }
  },
  logout: async (req, res, next) => {
    // Check cookies
    const cookies = req.cookies;
    if (!cookies?.auth_token)
      return sendError(res, "Coockie n'est pas trouvé, user déjà déconnecter");
    const token = cookies.auth_token;
    // Clear cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    // Send response
    sendResponse(res, null, "Utilisateur déconnecter");
  },
  update: async (req, res, next) => {
    const { id } = req.params;
    // Validate request
    const { error } = validate(req.body);
    if (error) return sendError(res, error.details[0].message);

    const {
        nom,
        pseudo,
        email,
        is_envoie_rappel,
        is_admin,
        tel,
        image_path,
      } = req.body;

      const password = generatePassword();

      var salt = bcrypt.genSaltSync(10);
      var hashedPassword = bcrypt.hashSync(password, salt);

    if(is_admin){
        try {
            // Update password
            const updatedUser = await utilisateur.update({
              where: { id: +id },
              data: {
                nom,
                pseudo,
                email,
                is_envoie_rappel,
                is_admin,
                tel,
                image_path,
                password: hashedPassword,
              },
            });

            delete updatedUser.password;
            if (updatedUser) {
              send_mail(
                email,
                "GESTION DE CONTRAT DE MAINTENANCE",
                `<p>Votre compte a été modifié par un super admin, voici votre nouveau mot de passe pour vous connecter : <strong>${password}</strong> </p><br><p>Vous pouvez le modifier à tout moment !</p>`
              );
              message = `Mise à jour avec succès, un nouveau mot de passe a été envoyé à son adresse email : ${updatedUser.email}  !`;
              sendResponse(res, updatedUser, message);
            }
          } catch (error) {
            console.log("error", error);
            if (error.code === "P2002")
              return sendError(
                res,
                "Email déjà utilisé par un autre utilisateur !"
              );
            sendError(res);
            // next(error)
        }
    }else{
        //verifySuperAdminCount, should be less than 4 super Admin
        let superAdminCount = 0;
        try {
          const superAdminCount_ = await utilisateur.count({
            where: {
               id:{
                not:{
                    equals: +id
                }
               },
                is_admin: false,
            },
          });
          superAdminCount = superAdminCount_;
        } catch (error) {
          console.log(error);
        }
    

        if (superAdminCount < 3) {
          try {
            // Update password
            const updatedUser = await utilisateur.update({
              where: { id: +id },
              data: {
                nom,
                pseudo,
                email,
                is_envoie_rappel,
                is_admin,
                tel,
                image_path,
                password: hashedPassword,
              },
            });

            delete updatedUser.password;
            if (updatedUser) {
              send_mail(
                email,
                "GESTION DE CONTRAT DE MAINTENANCE",
                `<p>Votre compte a été modifié par un super admin, voici votre nouveau mot de passe pour vous connecter : <strong>${password}</strong> </p><br><p>Vous pouvez le modifier à tout moment !</p>`
              );
              message = `Mise à jour avec succès, un nouveau mot de passe a été envoyé à son adresse email : ${updatedUser.email}  !`;
              sendResponse(res, updatedUser, message);
            }
          } catch (error) {
            console.log("error", error);
            if (error.code === "P2002")
              return sendError(
                res,
                "Email déjà utilisé par un autre utilisateur !"
              );
            sendError(res);
            // next(error)
          }
        // sendResponse(res,superAdminCount,"admin ")
        } else {
          sendError(res, "Le nombre de super admin est limité à 3 !");
        //   console.log("update user ++++++++++++, notttttt inferieur",superAdminCount);
        }
    }
  },
  delete: async (req, res, next) => {
    const { id } = req.params;
    // Delete  record
    try {
      const deleted_utilisateur = await utilisateur.delete({
        where: { id: +id }, // convert id to number <===> parseInt(id), Number(id)
      });
      return sendResponse(res, deleted_utilisateur, "Suppression avec succès");
    } catch (error) {
      sendError(res, error);
    }
  },
};

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
