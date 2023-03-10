const { PrismaClient } = require('@prisma/client')
const { contrat_garantie ,equipement,livraison,contrat_garantie_detail } = new PrismaClient()
const { validate_create } = require('../requests/contratGarantieRequest')
const { validate_update_contrat } = require('../requests/contratGarantieOnUpdateRequest')
const { sendResponse, sendError } = require('./baseController')
var moment = require('moment');
moment.locale('fr'); // 'fr'

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_contrat = await contrat_garantie.findMany({
                include: { 
                        contrat_garantie_detail:{
                            orderBy:{
                                date_fin: 'desc'
                            },
                            include:{
                                equipement:{
                                    include:{
                                        famille:{
                                            include:{
                                                service:true
                                            }
                                        }
                                    },
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
            sendResponse(res, all_contrat, "Liste de contrats de garantie")
 
        } catch (error) {
            return  sendError(res)
        }
    },
    getManyContratGarantie: async (req, res, next) => {
        const { array_of_id_contrat_garantie } = req.body 
        try {
            const all_contrat = await contrat_garantie_detail.findMany({
                where:{
                    contrat_garantie_id : { in : array_of_id_contrat_garantie }
                },
                orderBy:{
                    date_fin: 'desc'
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
                    contrat_garantie:{
                        include:{
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
                    }
                }
            })
            sendResponse(res, all_contrat, "Liste de contrats de garantie")
 
        } catch (error) {
            return  sendError(res)
        }
    },

    getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const contrat_ = await contrat_garantie.findUnique({
                where: { id: +id },
                include: { 
                    contrat_garantie_detail:{
                        orderBy:{
                            date_fin: 'asc'
                        },
                        include:{
                            equipement:{
                                include:{
                                    famille:{
                                        include:{
                                            service:true
                                        }
                                    }
                                },
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
             sendResponse(res, contrat_, "Information sur le contrat de garantie")
 
         } catch (error) {
            return  sendError(res)
         }
    }, 
    create: async (req, res, next) => {

            let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"

            // Validate request 
            const { error } = validate_create(req.body)
            if(error) {
                return sendError(res)
            }
            //Destructuring the body
            let {num_contrat,observation,livraison_id}=req.body;

            let contrat_garantie_detail_=[]
            let client_=null

            //get the date livraison , duree garantie pour des equipements qui est not null
            try {
                const livraison_ = await livraison.findUnique({
                    where: { 
                        id : +livraison_id
                    },
                    select:{
                        date_livraison:true,
                        client:{
                            select:{
                                id : true
                            }
                        },
                        equipement : {
                            where:{
                                duree_garantie : {
                                    not:null
                                },
                                famille: {
                                    isNot : {
                                        nom_famille : 'GAB'
                                    }
                                }
                            },
                            select : {
                                id:true,
                                duree_garantie:true
                            }
                        }
                    }
                }) 

                client_ = livraison_.client.id
    
                for(let index=0;index<livraison_?.equipement?.length;index++){
                    contrat_garantie_detail_.push({
                        date_debut:new Date(moment(livraison_.date_livraison)),
                        date_fin:new Date(moment(livraison_.date_livraison).add(livraison_.equipement[index].duree_garantie,"month").subtract(1,"day")),
                        date_alarm_before:new Date(moment(livraison_.date_livraison).add(livraison_.equipement[index].duree_garantie,"month").subtract(1,"day").subtract(45,"day")),
                        statut: statut(new Date(moment(livraison_.date_livraison).add(livraison_.equipement[index].duree_garantie,"month").subtract(1,"day"))),
                        equipement_id:livraison_.equipement[index].id
                        }) 
                }
                
            } catch (error) {
                console.log("error in add garantie",error);
            }
                
            try {
                const new_contrat_garantie = await contrat_garantie.create({
                    data: {
                        num_contrat,observation,livraison_id,
                        contrat_garantie_detail:{
                            create:contrat_garantie_detail_
                        }
                    }
                })
                return sendResponse(res, new_contrat_garantie, "Ajout avec succès")   
            } catch (error) {
                    //num_contrat should be unique for one client
                if(error.code==='P2002') return sendError(res,"Ce contrat de garantie existe déjà !")
                // console.log("autres error",error);
                return sendError(res)
            }
    },
    update: async (req, res, next) => {
        const { id } = req.params
        try {
            let statut = (date_fin_contrat)=> moment(date_fin_contrat).isBefore(moment(),"day") ? "Expiré" : "Valide"
            // Validate request 
            const { error } = validate_create(req.body)
            if(error) {
                return sendError(res)
            }
           //Destructuring the body
           let {num_contrat,observation,livraison_id}=req.body;

           let contrat_garantie_detail_=[]

            //get the date livraison , duree garantie pour des equipements qui est not null
            try {
                const livraison_ = await livraison.findUnique({
                    where: { 
                        id : +livraison_id
                    },
                    select:{
                        date_livraison:true,
                        client:{
                            select:{
                                id : true
                            }
                        },
                        equipement : {
                            where:{
                                duree_garantie : {
                                    not:null
                                },
                                famille: {
                                    isNot : {
                                        nom_famille : 'GAB'
                                    }
                                }
                            },
                            select : {
                                id:true,
                                duree_garantie:true
                            }
                        }
                    }
                }) 
            
                for(let index=0;index<livraison_?.equipement?.length;index++){
                    contrat_garantie_detail_.push({
                        date_debut:new Date(moment(livraison_.date_livraison)),
                        date_fin:new Date(moment(livraison_.date_livraison).add(livraison_.equipement[index].duree_garantie,"month").subtract(1,"day")),
                        date_alarm_before:new Date(moment(livraison_.date_livraison).add(livraison_.equipement[index].duree_garantie,"month").subtract(1,"day").subtract(45,"day")),
                        statut: statut(new Date(moment(livraison_.date_livraison).add(livraison_.equipement[index].duree_garantie,"month").subtract(1,"day"))),
                        equipement_id:livraison_.equipement[index].id
                        }) 
                }
                
            } catch (error) {
                console.log("error in add garantie",error);
            }
            

            // console.log("equipement object id : ", data_equipement_);

            const updated_contrat_garantie =  await contrat_garantie.update({
               where: { id: +id },
               data: {
                    observation,num_contrat,livraison_id,
                    contrat_garantie_detail:{
                        deleteMany:{},
                        create:contrat_garantie_detail_
                    }
                }
           })

           return sendResponse(res, updated_contrat_garantie, "Mise à jour avec succès")  
        } catch (error) {
            if(error.code==='P2002') return sendError(res,"Ce contrat de garantie existe déjà !")
                // console.log("autres error",error);
            return sendError(res)
        }
    }, 
 
    delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_contrat_garantie = await contrat_garantie.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
            return sendResponse(res, deleted_contrat_garantie, "Suppression avec succès")
 
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

