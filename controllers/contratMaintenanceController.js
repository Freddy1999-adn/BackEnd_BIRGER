const { PrismaClient } = require('@prisma/client')
const { contrat_maintenance ,contrat_maintenance_detail} = new PrismaClient()
const { validate_create } = require('../requests/contratMaintenanceRequest')
const { validate_update_contrat } = require('../requests/contratMaintenanceOnUpdateRequest')
const { validate_contrat_detail } = require('../requests/contratDetailRequest')
const { sendResponse, sendError } = require('./baseController')
var moment = require('moment');
moment.locale('fr'); // 'fr'

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_contrat = await contrat_maintenance.findMany({
                orderBy:{
                    date_debut:'asc'
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
            return  sendError(res)
        }
    },
    //this is for the export needed in homepage
    getManyContratMaintenance: async (req, res, next) => {
        const { array_of_id_contrat_maintenance } = req.body 
        try {
            const all_contrat = await contrat_maintenance_detail.findMany({
                where:{
                    contrat_maintenance_id : { in : array_of_id_contrat_maintenance }
                },
                include: { 
                    equipement:{
                        include:{
                            famille:{
                                include:{
                                    service:true
                                }
                            }
                        }
                    },
                   contrat_maintenance:{
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
            sendResponse(res, all_contrat, "Liste de contrats de maintenance")
 
        } catch (error) {
            return  sendError(res)
        }
    },
    getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const contrat_ = await contrat_maintenance.findUnique({
                where: { id: +id },
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
    filterContrat: async (req, res, next) => {
        const { date_debut,date_fin,statut,province,famille,service } = req.body 
        const dateFormat = (d)=>moment(d,"DD/MM/YYYY").format("YYYY-MM-DD")
        // province = (province === 0) ? {} : province
        // famille = (famille === 0) ? {} : famille
        // service = (service === 0) ? {} : service
        // filter 
        try {
           const contrat_filtered = await contrat_maintenance.findMany({
               where: {
                    // date_debut : { gte : new Date (dateFormat(date_debut)) },
                    // date_fin : { lte : new Date (dateFormat(date_fin)) },
                    // statut: statut,
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
   },
    create: async (req, res, next) => {
        try {
            // Validate request 
            const { error } = validate_create(req.body)
            if(error) {
                console.log(res,error.details[0].message);
                return sendError(res)
            }
            let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"
            
            //Destructuring the body
            let {num_contrat,num_facture,date_debut,date_facture,date_proposition,duree_annee,observation,client_id,equipement_id,redevance_totale}=req.body;
            date_debut = date_debut===null ? null : new Date(date_debut) 
            date_proposition = date_proposition===null ? null : new Date(date_proposition) 
            date_facture = date_facture===null ? null : new Date(date_facture) 
            let contrat_maintenance_=[]

            for(let i=1;i<=duree_annee;i++){
                contrat_maintenance_.push({
                    num_contrat,
                    num_facture,
                    date_facture,
                    date_debut:new Date(moment(date_debut).add(i-1,"year")),
                    date_proposition:date_proposition,
                    date_fin:new Date(moment(date_debut).add(i,"year").subtract(1,"day")),
                    date_alarm_before:new Date(moment(date_debut).add(i,"year").subtract(1,"day").subtract(45,"day")),
                    statut: statut(new Date(moment(date_debut).add(i,"year").subtract(1,"day"))),
                    observation,
                    client_id,
                    redevance_totale
                })
            }

            
            //equipement id should be like this : [{ id:int }, { id: int }, { id: int }]
            data_equipement_= []

            equipement_id.map((id_)=>{
                data_equipement_.push({
                    equipement_id:id_
                })
            })

            let new_contrat_maintenance=null
            contrat_maintenance_.map(async ({num_contrat,num_facture,observation,client_id,date_debut,date_facture,date_proposition,date_fin,date_alarm_before,statut,redevance_totale})=>{
                new_contrat_maintenance = await contrat_maintenance.create({
                    data: {
                        num_contrat,num_facture,observation,client_id,date_debut,date_facture,date_proposition,date_fin,date_alarm_before,statut,redevance_totale,
                        contrat_maintenance_detail:{
                            createMany:{
                                data:data_equipement_
                            }
                        }
                    }
                })
            })
            
            return sendResponse(res, new_contrat_maintenance, "Ajout avec succès")               
 
        } catch (error) {
            return  sendError(res)
        }
    },
    update: async (req, res, next) => {
        try {
            // Validate request 
            const { error } = validate_update_contrat(req.body)
            if(error) {
                console.log(res,error.details[0].message);
                return sendError(res)
            }
            const { id } = req.params
            
            let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"
            
            //Destructuring the body
            let {num_contrat,num_facture,redevance_totale,date_proposition,date_debut,date_facture,observation,client_id,equipement_id}=req.body;

            date_debut = date_debut===null ? null : new Date(date_debut) 
            date_proposition = date_proposition===null ? null : new Date(date_proposition) 
            date_facture = date_facture===null ? null : new Date(date_facture) 
            const date_fin=new Date(moment(date_debut).add(1,"year").subtract(1,"day"))
            statut = statut(date_fin)
            let date_alarm_before=new Date(moment(date_debut).add(1,"year").subtract(1,"day").subtract(45,"day"))

            //equipement id should be like this : [{ id:int }, { id: int }, { id: int }]
            data_equipement_= []

            equipement_id.map((id_)=>{
                data_equipement_.push({
                    equipement_id:id_
                })
            })

            const contrat_updated = await contrat_maintenance.update({
                where : {
                    id : +id
                },
                data: {
                    num_contrat,redevance_totale,num_facture,observation,client_id,date_debut,date_facture,date_fin,statut,date_proposition,date_alarm_before,
                    contrat_maintenance_detail:{
                        deleteMany:{},
                        createMany:{
                            data:data_equipement_
                        }
                    }
                }
            })

            return sendResponse(res, contrat_updated, "Mise à jour avec succès")      

        } catch (error) {
            //num_contrat should be unique for one client
            // if(error.code==='P2002') return sendError(res,"Ce numero contrat existe déjà !")
            return sendError(res)
        }
    },
    deleteContrat: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_contrat = await contrat_maintenance.delete({
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