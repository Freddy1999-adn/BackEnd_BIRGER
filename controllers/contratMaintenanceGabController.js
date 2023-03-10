const { PrismaClient } = require('@prisma/client')
const { contrat_maintenance_gab,redevance_gab } = new PrismaClient()
const { validate_create } = require('../requests/contratMaintenanceGabRequest')
const { validate_update_contrat } = require('../requests/contratMaintenanceOnUpdateRequest')
const { sendResponse, sendError } = require('./baseController')
var moment = require('moment');
moment.locale('fr'); // 'fr'

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_contrat = await contrat_maintenance_gab.findMany({
                orderBy:{
                    date_debut:'asc'
                },
                include: { 
                    redevance_gab:true,
                    equipement:{
                        include:{
                            famille:{
                                include:{
                                    service:true
                                }
                            }
                        }
                    },
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
            })
            sendResponse(res, all_contrat, "Liste de contrats de maintenance")
 
        } catch (error) {
            return  sendError(res,error)
        }
    },
    getRedevanceContratMaintenanceGab: async (req, res, next) => {
        const { array_of_id_contrat_maintenance_gab } = req.body 
        try {
            const all_contrat = await redevance_gab.findMany({
                where:{
                    contrat_maintenance_gab_id : { in : array_of_id_contrat_maintenance_gab }
                },
                include: { 
                    contrat_maintenance_gab:{
                        include:{
                            equipement:{
                                include:{
                                    famille:{
                                        include:{
                                            service:true
                                        }
                                    }
                                }
                            },
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
            sendResponse(res, all_contrat, "Liste de redvance de contrats de maintenance gab")
 
        } catch (error) {
            return  sendError(res,error)
        }
    },

    getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const contrat_ = await contrat_maintenance_gab.findUnique({
                where: { id: +id },
                include: { 
                    redevance_gab:true,
                    equipement:{
                        include:{
                            famille:{
                                include:{
                                    service:true
                                }
                            }
                        }
                    },
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
             })
             sendResponse(res, contrat_, "Information sur le contrat de maintenance")
 
         } catch (error) {
            return  sendError(res)
         }
    }, 
    create: async (req, res, next) => {
        try {
            // Validate request 
            const { error } = validate_create(req.body)
            if(error) {
                console.log(res,error.details[0].message);
                return sendError(res,error.details[0].message)
            }
            let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"
            
            //Destructuring the body
     
            let {date_debut,site_installation,redevance_totale,date_proposition,observation,client_id,equipement_id,redevance} = req.body
            let date_debut_ = new Date(date_debut) 
            date_proposition = date_proposition===null ? null : new Date(date_proposition) 
            let date_fin = new Date(moment(date_debut_).endOf('year'))
            let statut_ = statut(date_fin)
            let date_alarm_before =  new Date(moment(date_debut_).endOf('year').subtract(45,'day'))
            let annee_contrat = date_debut_.getFullYear()
            
            const redevance_gab = redevance.map((redevance)=>({...redevance,date_facture:handleDate(redevance.date_facture)}))

            let isEquipementAlreadyInContrat=null

            try {
            isEquipementAlreadyInContrat = await contrat_maintenance_gab.findFirst({
                where:{
                    equipement_id,
                    annee_contrat:+annee_contrat
                }
            })
            } catch (error) {
                console.log(error);
            }
            
            if(!isEquipementAlreadyInContrat){
                let new_contrat_maintenance_gab = await contrat_maintenance_gab.create({
                    data: {
                        date_debut: date_debut_,site_installation, redevance_totale,date_proposition,annee_contrat,observation,statut:statut_,date_fin,date_alarm_before,client_id,equipement_id,
                        redevance_gab:{
                            createMany:{
                                data:redevance_gab
                            }
                        }
                    }
                })
                return sendResponse(res, new_contrat_maintenance_gab, "Ajout avec succès")               
            }else{
                sendError(res,`cet équipement est déjà sous contrat pour l'année ${annee_contrat}`)
            }    
 
        } catch (error) {
            console.log(error);
            return  sendError(res,error)
        }
    },
    update: async (req, res, next) => {
        try {
            // Validate request 
            const { error } = validate_create(req.body)
            if(error) {
                console.log(res,error.details[0].message);
                return sendError(res,error.details[0].message)
            }
            //id to update
            const {id} = req.params

            let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"
            
            //Destructuring the body
     
            let {date_debut,site_installation, redevance_totale,date_proposition,observation,client_id,equipement_id,redevance} = req.body
            let date_debut_ = new Date(date_debut) 
            date_proposition = date_proposition===null ? null : new Date(date_proposition) 
            let date_fin = new Date(moment(date_debut_).endOf('year'))
            let statut_ = statut(date_fin)
            let date_alarm_before =  new Date(moment(date_debut_).endOf('year').subtract(45,'day'))
            let annee_contrat = date_debut_.getFullYear()
            
            const redevance_gab = redevance.map((redevance)=>({...redevance,date_facture:handleDate(redevance.date_facture)}))
           
            let isEquipementAlreadyInContrat=null

            try {
                isEquipementAlreadyInContrat = await contrat_maintenance_gab.findFirst({
                where:{
                    id:{
                        not:+id
                    },
                    equipement_id,
                    annee_contrat:+annee_contrat
                }
            })
            } catch (error) {
                console.log(error);
            }
            
            if(!isEquipementAlreadyInContrat){
                let updated_contrat_maintenance_gab = await contrat_maintenance_gab.update({
                    where:{
                        id:+id
                    },
                    data: {
                        date_debut: date_debut_,site_installation, redevance_totale,date_proposition,annee_contrat,observation,statut:statut_,date_fin,date_alarm_before,client_id,equipement_id,
                        redevance_gab:{
                            deleteMany:{},
                            createMany:{
                                data:redevance_gab
                            }
                        }
                    }
                })
                return sendResponse(res, updated_contrat_maintenance_gab, "Mise à jour avec succès")               
            }else{
                sendError(res,`cet équipement est déjà sous contrat pour l'année ${annee_contrat}`)
            }    
 
        } catch (error) {
            console.log(error);
            return  sendError(res,error)
        }
    },
    deleteContrat: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_contrat = await contrat_maintenance_gab.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_contrat, "Suppression avec succès")
 
         } catch (error) {
            return  sendError(res)
         }
    },
    deleteCheckedContrat: async (req, res, next) => {
        //delete multiple contrats
        const { array_of_id_contrat } = req.body
         try {
             const deleted_contrat_count = await contrat_maintenance.deleteMany({
                 where: { 
                        id : { in : array_of_id_contrat }
                    }
             })
             return sendResponse(res, deleted_contrat_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
            return  sendError(res)
         }
    }
}

const handleDate = (date)=>{
    const date_ = date ? new Date(date) : null
    return date_
}