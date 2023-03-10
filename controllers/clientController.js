const { PrismaClient } = require('@prisma/client')
const { client } = new PrismaClient()
const { validate } = require('../requests/clientRequest')
const { sendResponse, sendError } = require('./baseController')

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_client = await client.findMany({
                include: { 
                    ville: {
                       include:{
                            province:true
                       }
                    }
                }
            })
            sendResponse(res, all_client, "Liste de clients")
 
        } catch (error) {
            return sendError(res)
            // next(error)
        }
     }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const client_ = await client.findFirst({
                 where: { id: +id }, 
                 include: { 
                    ville: {
                       include:{
                            province:true
                       }
                    }
                }
             })
 
             sendResponse(res, client_, "Information sur le client")
 
         } catch (error) {
            return sendError(res)
         }
     }, 
 
     create: async (req, res, next) => {
        try {
            // Validate request 
           const { error } = validate(req.body)
            if(error){
                console.log(error.details[0].message);
                return  sendError(res)
            }

            //Destructuring the body
            const {nom_client,adresse,email,tel,ville}=req.body;

            //create new client
             const new_client = await client.create({
                data: {
                    nom_client,adresse,email,tel,ville_id: ville
                }
              })

              return sendResponse(res, new_client, "Ajout avec succès")
            
        } catch (error) {
            console.log(error);
            return sendError(res)
        }
    }, 
 
     update: async (req, res, next) => {
        const { id } = req.params
        try {
            const {nom_client,adresse,email,tel,ville}=req.body;
            // Validate request 
            const { error } = validate(req.body)
            if(error) return sendError(res,error.details[0].message)
           
            const updated_client =  await client.update({
               where: { id: +id },
               data:{
                nom_client,adresse,email,tel,ville_id: ville
               }
           })

           return sendResponse(res, updated_client, "Mise à jour avec succès")
        } catch (error) {
            return sendError(res)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 

         try {
            const deleted_client = await client.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_client, "Suppression avec succès")
 
         } catch (error) {
            return sendError(res)
            
         }
     },
     deleteChecked: async (req, res, next) => {
        //delete multiple clients
        const { array_of_id_client } = req.body
         try {
             const deleted_client_count = await client.deleteMany({
                 where: { 
                        id : { in : array_of_id_client }
                    }
             })
        return sendResponse(res, deleted_client_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
            return sendError(res)
         }
     }
}