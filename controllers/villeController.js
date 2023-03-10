const { PrismaClient } = require('@prisma/client')
const { ville } = new PrismaClient()
const { validate } = require('../requests/villeRequest')
const { sendResponse, sendError } = require('./baseController')

module.exports={
    getAll: async (req, res, next) => {
        try {
            // const all_service = await service.findMany()
            const all_ville= await ville.findMany({
                include: { 
                    province:true,
                    client: true 
                }
            })
            sendResponse(res, all_ville, "Liste de villes")
 
        } catch (error) {
            next(error)
        }
     }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const ville_ = await ville.findFirst({
                 where: { id: +id },
                 include: { client: true }
             })
 
             sendResponse(res, ville_, "Information sur service")
 
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
            const {nom_ville,province_id}=req.body;

            //create new client
             const new_ville = await ville.create({
                data: {
                    nom_ville,province_id
                    }
              })

              return sendResponse(res, new_ville, "Ajout avec succès")
            
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
            const {nom_ville,province_id}=req.body;

            const updated_ville =  await ville.update({
               where: { id: +id },
               data: {
                    nom_ville,province_id
                }
           })

           return sendResponse(res, updated_ville, "Mise à jour avec succès")
        } catch (error) {
            next(error)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_ville= await ville.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_ville, "Suppression avec succès")
 
         } catch (error) {
            // if (error.code === 'P2003') return sendError(res,"On ne peut pas supprimer cette ville, parce qu'elle est encore rattachée à un client, veuillez supprimez d'abord le client correspondant","foreign_key_constraint")
            // next(error)
            console.log(error);
         }
     },
     deleteChecked: async (req, res, next) => {
        //delete multiple modele
        const { array_of_id_ville} = req.body
         try {
             const deleted_ville_count = await ville.deleteMany({
                 where: { 
                        id : { in : array_of_id_ville }
                    }
             })
        return sendResponse(res, deleted_ville_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
            if (error.code === 'P2003') return sendError(res,"On ne peut pas supprimer cette ville, parce qu'elle est encore rattachée à un client, veuillez supprimez d'abord le client correspondant","foreign_key_constraint")
            next(error)
         }
     }
}