const { PrismaClient } = require('@prisma/client')
const { contrat_maintenance,contrat_maintenance_gab,contrat_garantie_gab,contrat_garantie } = new PrismaClient()
const { validate_create } = require('../requests/contratMaintenanceRequest')
const { validate_update_contrat } = require('../requests/contratMaintenanceOnUpdateRequest')
const { validate_contrat_detail } = require('../requests/contratDetailRequest')
const { sendResponse, sendError } = require('./baseController')
var moment = require('moment');
moment.locale('fr'); // 'fr'

const dateFormat = (d)=>moment(d,"DD/MM/YYYY").format("YYYY-MM-DD")

module.exports={
    getAllContratCountBetween2Date: async (req, res, next) => {
        const contrat_maintenance_valide_between_2_days_count = await getContratValideMaintenanceBetween2Date(req,res)
        const contrat_maintenance_expire_between_2_days_count = await getContratExpireMaintenanceBetween2Date(req,res)
        
        const contrat_maintenance_gab_valide_between_2_days_count = await getContratValideMaintenanceGabBetween2Date(req,res)
        const contrat_maintenance_gab_expire_between_2_days_count = await getContratExpireMaintenanceGabBetween2Date(req,res)
        
        const contrat_garantie_gab_valide_between_2_days_count = await getContratValideGarantieGabBetween2Date(req,res)
        const contrat_garantie_gab_expire_between_2_days_count = await getContratExpireGarantieGabBetween2Date(req,res)
        
        const contrat_garantie_valide_between_2_days_count = await getContratValideGarantieBetween2Date(req,res)
        const contrat_garantie_expire_between_2_days_count = await getContratExpireGarantieBetween2Date(req,res)

        const contrat_count = {
            garantie:{
                valide:contrat_garantie_valide_between_2_days_count,
                expire:contrat_garantie_expire_between_2_days_count
            },
            garantie_gab:{
                valide:contrat_garantie_gab_valide_between_2_days_count,
                expire:contrat_garantie_gab_expire_between_2_days_count
            },
            maintenance:{
                valide:contrat_maintenance_valide_between_2_days_count,
                expire:contrat_maintenance_expire_between_2_days_count
            },
            maintenance_gab:{
                valide:contrat_maintenance_gab_valide_between_2_days_count,
                expire:contrat_maintenance_gab_expire_between_2_days_count
            },
        }

        sendResponse(res,contrat_count, "Liste de contrats entre 2 dates !") 
    },
    filterContrat: async (req, res, next) => {
        const { date_debut,date_fin,statut,province,famille,service } = req.body 
        try {
           const contrat_filtered = await contrat_maintenance.findMany({
               where: {
                    client:{
                        is:{
                            province_id:province
                        }
                    },
                    contrat_maintenance_detail:{
                        some:{
                            equipement:{
                                famille:{
                                    is:{
                                        id:famille,
                                        service_id:service
                                    },
                                }
                            }
                        }
                    }
                },
                include: { 
                    contrat_maintenance_detail:{
                        include:{
                            equipement:{
                                include:{
                                    famille:{
                                        include:{
                                            service:true
                                        }
                                    }
                                }
                            }
                        },
                    },
                    client:{
                        include:{province : true}
                    }
                }
           })
            return sendResponse(res, contrat_filtered, "Liste de contrat filtré")

        } catch (error) {
           return  next(error)
        }
    }
}

//get contrat maintenance Expiré count between 2 Date
const getContratExpireMaintenanceBetween2Date = async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 


    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratMaintenanceBetween2Date = await contrat_maintenance.count({
                where:{
                    statut: "Expiré",
                    date_debut : { gte : new Date (date_debut_contrat) },
                    date_fin : { lte : new Date (date_fin_contrat) }
                }
            })
    
            return contratMaintenanceBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}
//get contrat maintenance Valide count between 2 Date
const getContratValideMaintenanceBetween2Date = async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 

    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratMaintenanceBetween2Date = await contrat_maintenance.count({
                where:{
                    statut: "Valide",
                    date_debut : { gte : new Date (date_debut_contrat) },
                    date_fin : { lte : new Date (date_fin_contrat) }
                }
            })
    
            return contratMaintenanceBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}

//get contrat maintenance Expiré count between 2 Date
const getContratExpireMaintenanceGabBetween2Date = async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 

    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratMaintenanceGabBetween2Date = await contrat_maintenance_gab.count({
                where:{
                    statut: "Expiré",
                    date_debut : { gte : new Date (date_debut_contrat) },
                    date_fin : { lte : new Date (date_fin_contrat) }
                }
            })
    
            return contratMaintenanceGabBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}
//get contrat maintenance gab Valide count between 2 Date
const getContratValideMaintenanceGabBetween2Date = async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 

    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratMaintenanceGabBetween2Date = await contrat_maintenance_gab.count({
                where:{
                    statut: "Valide",
                    date_debut : { gte : new Date (date_debut_contrat) },
                    date_fin : { lte : new Date (date_fin_contrat) }
                }
            })
    
            return contratMaintenanceGabBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}


//get contrat garantie gab Valide count between 2 Date
const getContratExpireGarantieGabBetween2Date= async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 

    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratGarantieGabBetween2Date = await contrat_garantie_gab.count({
                where:{
                    statut: "Expiré",
                    date_installation : { gte : new Date (date_debut_contrat) },
                    date_fin : { lte : new Date (date_fin_contrat) }
                }
            })
    
            return contratGarantieGabBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}

//get contrat garantie gab Valide count between 2 Date
const getContratValideGarantieGabBetween2Date= async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 

    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratGarantieGabBetween2Date = await contrat_garantie_gab.count({
                where:{
                    statut: "Valide",
                    date_installation : { gte : new Date (date_debut_contrat) },
                    date_fin : { lte : new Date (date_fin_contrat) }
                }
            })
    
            return contratGarantieGabBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}

//get contrat garantie Valide count between 2 Date
const getContratValideGarantieBetween2Date= async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 

    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratGarantieBetween2Date = await contrat_garantie.count({
                where:{
                    contrat_garantie_detail:{
                        some:{
                            statut: "Valide",
                            date_debut:{
                                gte:new Date(date_debut_contrat)
                            },
                            date_fin:{
                                lte: new Date(date_fin_contrat)
                            }
                        }
                    }
                }
            })
    
            return contratGarantieBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}

//get contrat garantie Expire count between 2 Date
const getContratExpireGarantieBetween2Date= async (req, res, next) => {
        
    //destructuring
    const { date_debut_contrat,date_fin_contrat} = req.body 

    if(!date_debut_contrat || !date_fin_contrat){
        return 0
    }else{
        try {
            const  contratGarantieBetween2Date = await contrat_garantie.count({
                where:{
                    contrat_garantie_detail:{
                        some:{
                            statut: "Expiré",
                            date_debut:{
                                gte:new Date(date_debut_contrat)
                            },
                            date_fin:{
                                lte: new Date(date_fin_contrat)
                            }
                        }
                    }
                }
            })
    
            return contratGarantieBetween2Date
        } catch (error) {
            console.log(error);
        }
    }
}




   
