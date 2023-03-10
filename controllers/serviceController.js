const { PrismaClient } = require('@prisma/client')
const { service } = new PrismaClient()
const { validate } = require('../requests/serviceRequest')
const { sendResponse, sendError } = require('./baseController')

module.exports={
    getAll: async (req, res, next) => {
        try {
            // const all_service = await service.findMany()
            const all_service = await service.findMany({
                include: {
                    famille:{
                        include:{
                            equipement: true
                        }
                    } 
                }
            })
            sendResponse(res, all_service, "Liste de services")
 
        } catch (error) {
            return  sendError(res)
            // next(error)
        }
     }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const service_ = await service.findFirst({
                 where: { id: +id },
                 include: { famille: true }
             })
 
             sendResponse(res, service_, "Information sur service")
 
         } catch (error) {
            return  sendError(res)
         }
     }, 
 
     create: async (req, res, next) => {
        try {
            // Validate request 
           const { error } = validate(req.body)
            if(error) {
                console.log(res,error.details[0].message);
                return sendError(res)
            }
           
            //Destructuring the body
            const {nom_service,description} = req.body;

            //create new client
             const new_service = await service.create({
                data: {
                        nom_service,description
                    }
              })

              return sendResponse(res, new_service, "Ajout avec succès")
            
        } catch (error) {
            return  sendError(res)
        }
    }, 
 
     update: async (req, res, next) => {
        const { id } = req.params
        try {

            const {nom_service,description}=req.body;
            // Validate request 
            const { error } = validate(req.body)
            if(error) return sendError(res,error.details[0].message)
           
            const updated_service =  await service.update({
               where: { id: +id },
               data: {
                    nom_service,description
                }
           })

           return sendResponse(res, updated_service, "Mise à jour avec succès")
        } catch (error) {
            return  sendError(res)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_service = await service.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_service, "Suppression avec succès")
 
         } catch (error) {
             return  sendError(res)
         }
     },
     deleteChecked: async (req, res, next) => {
        const { array_of_id_service} = req.body
         try {
             const deleted_service_count = await service.deleteMany({
                 where: { 
                        id : { in : array_of_id_service }
                    }
             })
        return sendResponse(res, deleted_service_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
             sendError(res)
             // if (error.code === 'P2003') return sendError(res,"On ne peut pas supprimer ce service, parce qu'il est encore rattaché à une famille d'equipement materiel, veuillez supprimez d'abord la famille correspondante ","foreign_key_constraint")
         }
     }
}