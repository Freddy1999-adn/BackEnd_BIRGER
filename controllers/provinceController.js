const { PrismaClient } = require('@prisma/client')
const { province } = new PrismaClient()
const { validate } = require('../requests/provinceRequest')
const { sendResponse, sendError } = require('./baseController')

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_province= await province.findMany({
                include: { 
                    ville: {
                        include: {
                            client : true
                        }
                    }
                }
            })
            sendResponse(res, all_province, "Liste de provinces")
 
        } catch (error) {
            next(error)
        }
     }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const province_ = await province.findFirst({
                 where: { id: +id },
                 include: { 
                    ville: {
                        include: {
                            client : true
                        }
                    }
                }
             })
 
             sendResponse(res, province_, "Information sur service")
 
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
            const {nom_province}=req.body;

            //create new client
             const new_province = await province.create({
                data: {
                    nom_province
                    }
              })

              return sendResponse(res, new_province, "Ajout avec succes")
            
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
            const {nom_province}=req.body;

            const updated_province =  await province.update({
               where: { id: +id },
               data: {
                    nom_province
                }
           })

           return sendResponse(res, updated_province, "Update avec succes")
        } catch (error) {
            next(error)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_province= await province.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_province, "Suppression avec succès")
 
         } catch (error) {
            if (error.code === 'P2003') return sendError(res,"On ne peut pas supprimer cette province, parce qu'elle est encore rattachée à un client, veuillez supprimez d'abord le client correspondant","foreign_key_constraint")
            next(error)
         }
     },
     deleteChecked: async (req, res, next) => {
        //delete multiple modele
        const { array_of_id_province} = req.body
         try {
             const deleted_province_count = await province.deleteMany({
                 where: { 
                        id : { in : array_of_id_province }
                    }
             })
        return sendResponse(res, deleted_province_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
            if (error.code === 'P2003') return sendError(res,"On ne peut pas supprimer cette province, parce qu'elle est encore rattachée à un client, veuillez supprimez d'abord le client correspondant","foreign_key_constraint")
            next(error)
         }
     }
}