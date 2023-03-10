const { PrismaClient } = require('@prisma/client')
const { famille } = new PrismaClient()
const { validate } = require('../requests/familleRequest')
const { sendResponse, sendError } = require('./baseController')

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_famille = await famille.findMany({
                include: {
                    service: true,
                    equipement: true
                }
            })
            sendResponse(res, all_famille, "Liste de familles")
 
        } catch (error) {
           return  sendError(res)
            // next(error)
        }
     }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const famille_ = await famille.findFirst({
                 where: { id: +id }, 
                 include: { service:true,
                            equipement: true 
                         }
             })
 
             sendResponse(res, famille_, "Information sur famille")
 
         } catch (error) {
            return sendError(res)
            // next(error)
         }
     }, 
 
     create: async (req, res, next) => {
        try {
            // Validate request 
           const { error } = validate(req.body)
           if(error) {
            console.log("erreur erreur : ",error.details[0].message);
            return sendError(res)
            }
            //Destructuring the body
            const {nom_famille,service_id}=req.body;

            //create new client
             const new_famille = await famille.create({
                data: {
                        nom_famille,service_id
                    }
              })

              return sendResponse(res, new_famille, "Ajout avec succès")
        } catch (error) {
            return sendError(res)
            // next(error)
        }
    }, 
 
     update: async (req, res, next) => {
        const { id } = req.params
        try {

            const {nom_famille,service_id}=req.body;
            // Validate request 
            const { error } = validate(req.body)
            if(error) {
                console.log("erreur erreur : ",error.details[0].message);
                return sendError(res)
            }
           
            const updated_famille=  await famille.update({
               where: { id: +id },
               data: {
                    nom_famille,service_id
                }
           })

           return sendResponse(res, updated_famille, "Mise à jour avec succès")
        } catch (error) {
            return sendError(res)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_famille = await famille.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_famille, "Suppression avec succès")
 
         } catch (error) {
             return sendError(res)
         }
     },
     deleteChecked: async (req, res, next) => {
        const { array_of_id_famille} = req.body
         try {
             const deleted_famille_count = await famille.deleteMany({
                 where: { 
                        id : { in : array_of_id_famille }
                    }
             })
        return sendResponse(res, deleted_famille_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
            return sendError(res)
            // if (error.code === 'P2003') return sendError(res,"On ne peut pas supprimer cette famille d'equipement, parce qu'elle est encore rattachée à une marque","foreign_key_constraint")
        }
     }
}