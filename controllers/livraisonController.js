const { PrismaClient } = require('@prisma/client')
const { livraison,utilisateur,equipement} = new PrismaClient()
const { validate } = require('../requests/livraisonRequest')
const { sendResponse, sendError } = require('./baseController')
var moment = require('moment');

module.exports={
    getAll: async (req, res, next) => {
        try {
            const all_livraison = await livraison.findMany({
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
                    client:{
                        include:{
                            ville : {
                                include:{
                                    province:true
                                }
                            }
                        }
                    },
                    contrat_garantie: true
                }
            })

            sendResponse(res, all_livraison, "Liste de livraisons")
 
        } catch (error) {
           console.log("the error", error);
            return  sendError(res)
        }
     }, 

    getManyLivraison: async (req, res, next) => {
        const { array_of_id_livraison } = req.body 
        try {
            const equipement_livred = await equipement.findMany({
                where:{
                    livraison_id : { in : array_of_id_livraison }
                },
                include: { 
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
            })

            sendResponse(res, equipement_livred, "Liste des equipements livrés")
 
        } catch (error) {
           console.log("the error", error);
            return  sendError(res)
        }
    }, 
 
     getById: async(req, res, next) => {
         try {
             const { id } = req.params
             const livraison_ = await livraison.findUnique({
                where: { id: +id },
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
                    client:{
                        include:{
                            ville : {
                                include:{
                                    province:true
                                }
                            }
                        }
                    }
                }
             })
             
             sendResponse(res, livraison_, "Information sur le livraison")
 
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
            const {date_livraison,num_bon_livraison,num_facture,client,equipement,date_facture,observation}=req.body;
            
            const date_livraison_ = new Date(date_livraison) 
            const date_facture_ = date_facture===null ? null : new Date(date_facture) 

            //equipement id should be like this : [{ id:int }, { id: int }, { id: int }]
            data_equipement_= []

            equipement.map((id_)=>{
                data_equipement_.push({
                    id:id_
                })
            })

            //create new livraison
             const new_livraison = await livraison.create({
                data: {
                    date_livraison:date_livraison_,date_facture:date_facture_,observation,num_bon_livraison,num_facture,client_id:+client,
                    equipement:{
                        connect: data_equipement_
                    }
                }
              })

              return sendResponse(res, new_livraison, "Ajout avec succès")
            
        } catch (error) {
            if(error.code==='P2002') return sendError(res,"Ce numero de bon de livraison ou ce numero de Facture existe déjà !")
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
             const {date_livraison,num_bon_livraison,num_facture,client,equipement,date_facture,observation}=req.body;
            
             const date_livraison_ = date_livraison===null ? null : new Date(date_livraison) 
             const date_facture_ = date_facture===null ? null : new Date(date_facture) 
           
           //equipement id should be like this : [{ id:int }, { id: int }, { id: int }]
           data_equipement_= []

           equipement.map((id_)=>{
               data_equipement_.push({
                   id:id_
               })
           })

            const updated_livraison =  await livraison.update({
               where: { id: +id },
                data: {
                    date_livraison:date_livraison_,date_facture:date_facture_,num_bon_livraison,num_facture,client_id:+client,observation,
                    equipement:{
                        set: [], //set null All equipement  related to this livraison
                        connect: data_equipement_
                    }
                }
           })

           return sendResponse(res, updated_livraison, "Mise à jour avec succès") 
        } catch (error) {
            if(error.code==='P2002') return sendError(res,"Ce numero de bon de livraison ou ce numero de Facture existe déjà !")
            console.log(error);
            return sendError(res)
        }
    }, 
 
     delete: async (req, res, next) => {
         const { id } = req.params 
         // Delete  record 
         try {
            const deleted_livraison = await livraison.delete({
                where: { id: +id } // convert id to number <===> parseInt(id), Number(id)
            })
             return sendResponse(res, deleted_livraison, "Suppression avec succès")
 
         } catch (error) {
            return sendError(res)
         }
     },
     deleteChecked: async (req, res, next) => {
        //delete multiple livraisons
        const { array_of_id_livraison } = req.body
         try {
             const deleted_livraison_count = await livraison.deleteMany({
                where: { 
                        id : { in : array_of_id_livraison }
                }
             })
        return sendResponse(res, deleted_livraison_count, "Suppression plusieurs avec succès")
 
         } catch (error) {
            return sendError(res)
         }
     }


























    //livraison_to_notify
    // checkLivraison: async (req, res, next) => {
    //     try {
    //         const livraison_avec_garantie_non_notifie = await livraison.findMany({
    //             where:{
    //                 NOT:[
    //                     {
    //                         equipement:{duree_garantie:null}
    //                     }
    //                 ],
    //                 date_notification:null
    //             },
    //             include: { 
    //                 equipement:true
    //             }
    //         })

    //         //date_aujourdhui
    //         const date_today = moment()

    //         //date_fin_garantie moins 1 mois
    //         let date_notification = null

    //         //date fin de garantie
    //         let date_fin_garantie = null

    //         // liste des id des livraison à notifier
    //         const id_livraison_to_notify = []

    //         livraison_avec_garantie_non_notifie.map((livraison)=>{
    //             date_fin_garantie = moment(livraison.date_livraison).add(livraison.equipement.duree_garantie, 'days');
    //             livraison.date_garantie = date_fin_garantie
                
    //             date_notification = moment(date_fin_garantie).subtract(1, 'month')
    //             console.log("date notification de l'id : "+livraison.id+" ",date_notification);
                
    //             //date_notif(inferieur ou egal à today) ------ today ------date_fin_garantie

    //             if(date_today.isSameOrAfter(date_notification,"day")) {
    //                 console.log("test point : ",moment(date_today).isSameOrAfter(date_notification, 'day'))
    //                 id_livraison_to_notify.push(livraison.id)
    //             }

                
    //        })
    //     //    send_notification(id_livraison_to_notify)
    //        console.log("id_livraison_to_notify ",id_livraison_to_notify);
    //         sendResponse(res, livraison_avec_garantie_non_notifie, "Check Liste de livraisons")
 
    //     } catch (error) {
    //         next(error)
    //     }
    // }, 

}

// const send_notification = async (array_of_id_livraison)=>{
//     try {
//         const all_livraison = await livraison.findMany({
//             where:{
//                 id : { in : array_of_id_livraison }
//             },
//             include: { 
//                 equipement:{
//                     include:{
//                         modele:{
//                             include:{
//                                 marque:{
//                                     include:{
//                                         famille:{
//                                             include:{
//                                                 service:true
//                                             }
//                                         }
//                                     }
//                             }}
//                         }
//                     }
//                 },
//                 client:{
//                     include:{province : true}
//                 }
//             }
//         })

//         all_livraison.map((livraison)=>{
//             if(livraison.equipement.duree_garantie){
//                 let date_fin_garantie = moment(livraison.date_livraison).add(livraison.equipement.duree_garantie, 'days');
//                 livraison.date_garantie=date_fin_garantie
//             }else{
//                 livraison.date_garantie="Pas de garantie"
//             }
//        })

//         const email_user= await utilisateur.findMany({
//             where: { is_envoie_rappel: true },
//             select:{email:true}
//         })

//         email_user.forEach((user)=>{
            
//             console.log("envoie de email à : ",user.email);
//         })
//         // sendResponse(res, email, "Liste de livraisons")

//     } catch (error) {
//         next(error)
//     }
// }