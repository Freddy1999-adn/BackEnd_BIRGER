const { PrismaClient } = require('@prisma/client')
const { equipement } = new PrismaClient()
const { validate } = require('../requests/equipementRequest')
const { sendResponse, sendError } = require('./baseController')

//note that equipement has a livraison ou contrat ne devrait pas avoir un bouton delete 
module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_equipement = await equipement.findMany({
                include: {
                    famille: {
                        include:{
                            service: true
                        }
                    },
                    livraison:{
                        include:{
                            client:{
                                include:{
                                    ville :{
                                        include: {
                                            province: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            sendResponse(res, all_equipement, "Liste de l'equipements")
 
        } catch (error) {
            return sendError(res)
        }
     }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const equipement_ = await equipement.findUnique({
                where: { id: +id },
                include: {
                    famille: {
                        include:{
                            service: true
                        }
                    },
                    livraison:{
                        include:{
                            client:{
                                include:{
                                    ville :{
                                        include: {
                                            province: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
             })
             sendResponse(res, equipement_, "Information sur l'equipement")
 
         } catch (error) {
            return sendError(res)
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
            let {num_serie,is_locale,duree_garantie,modele,marque,famille,redevance_contrat,fournisseur}=req.body;
            console.log("redeeeee",redevance_contrat);
            //create new equipement
             const new_equipement = await equipement.create({
                data: {
                    num_serie,is_locale,duree_garantie,redevance_contrat,modele,marque,famille_id:famille,fournisseur
                }
              })

              return sendResponse(res, new_equipement, "Ajout avec succès")
            
        } catch (error) {
            if(error.code==='P2002') return sendError(res,"Cet équipement existe déjà !")
            return sendError(res)
        }
    }, 
 
     update: async (req, res, next) => {
        const { id } = req.params
        try {

            // Validate request 
            const { error } = validate(req.body)
            if(error) {
                console.log(res,error.details[0].message);
                return sendError(res)
            }
            //Destructuring the body
            let {num_serie,is_locale,duree_garantie,redevance_contrat,modele,marque,famille,fournisseur}=req.body;
            redevance_contrat = (redevance_contrat?.toString().trim()==='' ) ? null : +redevance_contrat

            const updated_equipement =  await equipement.update({
               where: { id: +id },
               data:{
                    num_serie,is_locale,duree_garantie,redevance_contrat,modele,marque,famille_id:famille,fournisseur
               }
           })

           return sendResponse(res, updated_equipement, "Mise à jour avec succès")
        } catch (error) {
            if(error.code==='P2002') return sendError(res,"Cet équipement existe déjà !")
            console.log("error++++++",error);
            return sendError(res,error)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 

         try {
            const deleted_equipement = await equipement.delete({
                where: { id: +id }
            })
            return sendResponse(res, deleted_equipement, "Suppression avec succès")
            
        } catch (error) {
            return sendError(res)
        }
     },
     deleteChecked: async (req, res, next) => {
        //delete multiple equipements
        const { array_of_id_equipement } = req.body
         try {
             const deleted_equipement_count = await equipement.deleteMany({
                 where: { 
                        id : { in : array_of_id_equipement }
                    }
            })
            return sendResponse(res, deleted_equipement_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
            return sendError(res)
         }
     },

   
    //GARANTIE GAB
    //equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat
    getEquipementToAddInContratGarantieGab: async (req, res, next) =>{
        try {
            const equip_not_have_contrat = await equipement.findMany({
                where: { 
                    famille: {
                        is : {
                            nom_famille : 'GAB'
                        }
                    },
                    duree_garantie:{
                        not:null
                    },
                    livraison:{ 
                        is: {} //livraison exist
                    },
                    contrat_garantie_detail: { 
                        none: {} //contrat detail not exist 
                    },   
                    contrat_garantie_gab: { 
                        none: {} //contrat gab not exist 
                    }
                },
                include:{
                    famille:{
                        include : {
                            service : true
                        }
                    },
                    livraison:{
                        include:{
                            client:{
                                include:{
                                    ville:{
                                        include : {
                                            province: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
            })
            sendResponse(res, equip_not_have_contrat, "equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat")
        } catch (error) {
            next(error)
        }
    },
    //equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat
    getEquipementToEditInContratGarantieGab: async (req, res, next) =>{
        const { equipement_id } = req.params 
        try {
            const equip_not_have_contrat = await equipement.findMany({
                where: { 
                    OR:[
                        {
                            id: +equipement_id
                        },
                        {
                            contrat_garantie_gab:{
                                none:{}
                            }
                        }
                    ],
                    famille: {
                        is : {
                            nom_famille : 'GAB'
                        }
                    },
                    duree_garantie:{
                        not:null
                    },
                    livraison:{ 
                        is: {} //livraison exist
                    }
                },
                include:{
                    famille:{
                        include : {
                            service : true
                        }
                    },
                    livraison:{
                        include:{
                            client:{
                                include:{
                                    ville:{
                                        include : {
                                            province: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
            })
            sendResponse(res, equip_not_have_contrat, "equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat")
        } catch (error) {
            next(error)
        }
    },

    //MAINTENANCE GAB
     //equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat
     getEquipementToAddInContratMaintenanceGab: async (req, res, next) =>{
        try {
            const gab_not_have_contrat = await equipement.findMany({
                where: { 
                    famille: {
                        is : {
                            nom_famille : 'GAB'
                        }
                    },
                    contrat_maintenance_gab:{
                        none:{}
                    }
                },
                include:{
                    famille:{
                        include : {
                            service : true
                        }
                    },
                    contrat_maintenance_gab:true
                }           
            })
            sendResponse(res, gab_not_have_contrat, "equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat")
        } catch (error) {
            next(error)
        }
    },

    //edit
     getEquipementToEditInContratMaintenanceGab: async (req, res, next) =>{
        const { equipement_id } = req.params 
        try {
            const gab_not_have_contrat = await equipement.findMany({
                where: { 
                    OR:[
                        {
                            id: +equipement_id
                        },
                        {
                            contrat_maintenance_gab:{
                                none:{}
                            }
                        }
                    ],
                    famille: {
                        is : {
                            nom_famille : 'GAB'
                        }
                    }
                },
                include:{
                    famille:{
                        include : {
                            service : true
                        }
                    },
                    contrat_maintenance_gab:true
                }           
            })
            sendResponse(res, gab_not_have_contrat, "equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat")
        } catch (error) {
            next(error)
        }
    },

    //CONTRAT MAINTENANCE
    //equipement to add in contrat maintenance
    getEquipementToAddInContratMaintenance: async (req, res, next) =>{
        try {
            const equipement_not_have_contrat = await equipement.findMany({
                where: { 
                    famille: {
                        isNot : {
                            nom_famille : 'GAB'
                        }
                    },
                    contrat_maintenance_detail:{
                        none:{}
                    }
                },
                include:{
                    famille:{
                        include : {
                            service : true
                        }
                    },
                }           
            })
            sendResponse(res, equipement_not_have_contrat, "equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat")
        } catch (error) {
            console.log(error);
            // next(error)
        }
    },
    //equipement to add in contrat maintenance
    getEquipementToRenewOrEditInContratMaintenance: async (req, res, next) =>{
        //Destructuring the body
        const {array_of_id_equipement_contrat}=req.body;
        try {
            const equipement_not_have_contrat = await equipement.findMany({
                where: { 
                    OR:[
                        {
                            id: { in: array_of_id_equipement_contrat }
                        },
                        {
                            contrat_maintenance_detail:{
                                none:{}
                            }
                        }
                    ],
                    famille: {
                        isNot : {
                            nom_famille : 'GAB'
                        }
                    }
                },
                include:{
                    famille:{
                        include : {
                            service : true
                        }
                    },
                    contrat_maintenance_detail:true
                }           
            })
            sendResponse(res, equipement_not_have_contrat, "equipement GAB livrée et ne contient n'est pas rattaché à aucun contrat")
        } catch (error) {
            console.log(error);
            // next(error)
        }
    },


    //equipement to edit in livraison
    getEquipementToEditInLivraison: async (req, res, next) =>{
        //Destructuring the body
        const {array_of_id_equipement_livraison}=req.body;
        try {
            const equipement_not_have_livraison = await equipement.findMany({
                where: { 
                    OR:[
                        {
                            id: { in: array_of_id_equipement_livraison }
                        },
                        {
                            livraison_id:null
                        }
                    ]
                },
                include:{
                    famille:{
                        include : {
                            service : true
                        }
                    },
                    livraison:true
                }           
            })
            sendResponse(res, equipement_not_have_livraison, "equipement_not_have_livraison")
        } catch (error) {
            console.log(error);
            // next(error)
        }
    },

   
}