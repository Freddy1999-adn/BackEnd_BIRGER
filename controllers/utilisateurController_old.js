const { PrismaClient } = require('@prisma/client')
const { utilisateur } = new PrismaClient()
const { validate } = require('../requests/utilisateurRequest')
const { sendResponse, sendError } = require('./baseController')

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_utilisateur = await utilisateur.findMany()
            sendResponse(res, all_utilisateur, "Liste des utilisateurs")
 
        } catch (error) {
            next(error)
        }
     }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const utilisateur_ = await utilisateur.findFirst({
                 where: { id: +id }
             })
 
             sendResponse(res, utilisateur_, "Information sur le utilisateur")
 
         } catch (error) {
             next(error)
         }
     }, 
 
     create: async (req, res, next) => {
        try {
            // Validate request 
           const { error } = validate(req.body)
            if(error) return sendError(res,error.details[0].message)
           
            //Destructuring the body
            const {nom,pseudo,adresse,email,tel,image_path,is_envoie_rappel,is_admin}=req.body;

            //create new utilisateur
             const new_utilisateur = await utilisateur.create({
                data: {
                    nom,pseudo,adresse,email,tel,image_path,is_envoie_rappel,is_admin
                }
              })

              return sendResponse(res, new_utilisateur, "Ajout avec succès")
            
        } catch (error) {
            next(error)
        }
    }, 
 
     update: async (req, res, next) => {
        const { id } = req.params
        try {

            // Validate request 
            const { error } = validate(req.body)
            if(error) return sendError(res,error.details[0].message)
           
            //Destructuring the body
            const {nom,pseudo,adresse,email,tel,image_path,is_envoie_rappel,is_admin}=req.body;

            const updated_utilisateur =  await utilisateur.update({
               where: { id: +id },
               data:{
                    nom,pseudo,adresse,email,tel,image_path,is_envoie_rappel,is_admin
               }
           })

           return sendResponse(res, updated_utilisateur, "Update avec succes")
        } catch (error) {
            next(error)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_utilisateur = await utilisateur.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_utilisateur, "Suppression avec succès")
 
         } catch (error) {
             next(error)
         }
     }
}