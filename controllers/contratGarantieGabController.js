const { PrismaClient } = require('@prisma/client')
const { contrat_garantie_gab ,equipement,livraison } = new PrismaClient()
const { validate_create } = require('../requests/contratGarantieGabRequest')
// const { validate_update_contrat } = require('../requests/contratGarantieOnUpdateRequest')
const { sendResponse, sendError } = require('./baseController')
var moment = require('moment');
moment.locale('fr'); // 'fr'

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_contrat = await contrat_garantie_gab.findMany({
                orderBy:{
                    date_installation: 'desc',
                },
                include: { 
                        equipement:{
                            include:{
                                famille:{
                                    include:{
                                        service:true
                                    }
                                }
                            },
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
            sendResponse(res, all_contrat, "Liste de contrats de garantie Gab")
 
        } catch (error) {
            return  sendError(res,error)
        }
    },
    getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const contrat_ = await contrat_garantie_gab.findUnique({
                where: { id: +id },
                include: { 
                        equipement:{
                            include:{
                                famille:{
                                    include:{
                                        service:true
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
             sendResponse(res, contrat_, "Information sur le contrat de garantie gab")
 
         } catch (error) {
            console.log(error);
            return  sendError(res,error)
         }
    }, 
    create: async (req, res, next) => {

            let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"

            // Validate request 
            const { error } = validate_create(req.body)
            if(error) {
                console.log(res,error.details[0].message);
                return sendError(res)
            }
            //Destructuring the body
            let {site_installation,date_installation,observation,equipement}=req.body;
            date_installation = new Date(date_installation) 
            let contrat_garantie_gab_= {
                equipement_id: equipement.id,
                livraison_id: equipement.livraison_id,
                site_installation: site_installation,
                observation: observation,
                date_installation: new Date(moment(date_installation)),
                date_fin: new Date(moment(date_installation).add(equipement.duree_garantie,"month").subtract(1,"day")),
                date_alarm_before:new Date(moment(date_installation).add(equipement.duree_garantie,"month").subtract(1,"day").subtract(45,"day")),
                statut : statut(new Date(moment(date_installation).add(equipement.duree_garantie,"month").subtract(1,"day")))
            }


            try {
                const new_contrat_garantie_gab = await contrat_garantie_gab.create({
                    data: contrat_garantie_gab_
                })
                return sendResponse(res, new_contrat_garantie_gab, "Ajout avec succès")   
            } catch (error) {
                console.log("autres error",error);
                return sendError(res,error)
            }
    },
    update: async (req, res, next) => {
        const { id } = req.params
        let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"

        // Validate request 
        const { error } = validate_create(req.body)
        if(error) {
            console.log(res,error.details[0].message);
            return sendError(res)
        }
        //Destructuring the body
        let {site_installation,date_installation,observation,equipement}=req.body;
        date_installation = new Date(date_installation) 
        let contrat_garantie_gab_= {
            equipement_id: equipement.id,
            livraison_id: equipement.livraison_id,
            site_installation: site_installation,
            observation: observation,
            date_installation: new Date(moment(date_installation)),
            date_fin: new Date(moment(date_installation).add(equipement.duree_garantie,"month").subtract(1,"day")),
            date_alarm_before:new Date(moment(date_installation).add(equipement.duree_garantie,"month").subtract(1,"day").subtract(45,"day")),
            statut : statut(new Date(moment(date_installation).add(equipement.duree_garantie,"month").subtract(1,"day")))
        }

        try {
            const updated_contrat_garantie_gab = await contrat_garantie_gab.update({
                where:{id:+id},
                data: contrat_garantie_gab_
            })
            return sendResponse(res, updated_contrat_garantie_gab, "Mise à jour avec succès")   
        } catch (error) {
           if (error) console.log("autres error",error);
            return sendError(res,error)
        }
    }, 
 
    delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_contrat_garantie_gab = await contrat_garantie_gab.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
            return sendResponse(res, deleted_contrat_garantie_gab, "Suppression avec succès")
 
         } catch (error) {
            return sendError(res)
         }
     },
    deleteChecked: async (req, res, next) => {
    //delete multiple contrats
    const { array_of_id_contrat } = req.body
        try {
            const deleted_contrat_count = await contrat_garantie.deleteMany({
                where: { 
                    id : { in : array_of_id_contrat }
                }
            })
    return sendResponse(res, deleted_contrat_count, "Suppression plusieurs avec succès")

        } catch (error) {
            return sendError(res)
        }
    }
}

