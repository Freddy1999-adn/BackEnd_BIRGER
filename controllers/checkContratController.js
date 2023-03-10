const { PrismaClient } = require('@prisma/client')
const { contrat_maintenance,contrat_maintenance_gab,contrat_garantie_gab,contrat_garantie , contrat_garantie_detail,utilisateur } = new PrismaClient()
const {send_mail} = require("../tools/send_mail_contrat")
var moment = require('moment');
moment.locale('fr'); // 'fr'

const { sendResponse, sendError } = require('./baseController')
var moment = require('moment');
const {printToPDF} = require('../tools/printToPDF');
moment.locale('fr'); // 'fr'

module.exports={
    //should be, contrat alarmed before false et statut valide

    getContratForThisYear:  async (req,res,next)=> {
        const contrat_maintenance_for_current_year = await getContratMaintenanceForThisYear()
        
        const contrat_maintenance_gab_for_current_year = await getContratMaintenanceGabForThisYear()
        
        const contrat_garantie_for_current_year = await getContratGarantieForThisYear()

        const contrat_garantie_gab_for_current_year = await getContratGarantieGabForThisYear()

        const contrat_for_the_current_year= {
            garantie:contrat_garantie_for_current_year,
            garantie_gab:contrat_garantie_gab_for_current_year,
            maintenance:contrat_maintenance_for_current_year,
            maintenance_gab:contrat_maintenance_gab_for_current_year,
            garantieAndGarantieGab: contrat_garantie_for_current_year+contrat_garantie_gab_for_current_year,
            maintenanceAndMaintenanceGab: contrat_maintenance_for_current_year+contrat_maintenance_gab_for_current_year
        }
        sendResponse(res,contrat_for_the_current_year, "Liste de contrats pour l'année courant !") 
    },
    getContratExpiredIn45Days:  async (req,res,next)=> {
        const contrat_garantie_expired_in_45_days = await getContratGarantieExpiredIn45Days()

        const contrat_maintenance_expired_in_45_days = await getContratMaintenanceExpiredIn45Days()

        const contrat_maintenance_gab_expired_in_45_days = await getContratMaintenanceGabExpiredIn45Days()

        const contrat_garantie_gab_expired_in_45_days = await getContratGarantieGabExpiredIn45Days()

        const totale = contrat_garantie_expired_in_45_days.length + contrat_maintenance_expired_in_45_days.length + contrat_maintenance_gab_expired_in_45_days.length + contrat_garantie_gab_expired_in_45_days.length
        const contrat_expired_in_45_days= {
            garantie:contrat_garantie_expired_in_45_days,
            maintenance:contrat_maintenance_expired_in_45_days,
            garantie_gab:contrat_garantie_gab_expired_in_45_days,
            maintenance_gab:contrat_maintenance_gab_expired_in_45_days,
            totale : totale
        }
        sendResponse(res,contrat_expired_in_45_days, "Liste de contrats expiré dans le prochaine 45 jours !") 
    },

    getContratToNotify: async (req,res,next)=> {
        const contrat_garantie_ = await getContratGarantieToNotify()

        const contrat_maintenance_ = await getContratMaintenanceToNotify()

        const contrat_maintenance_gab_ = await getContratMaintenanceGabToNotify()

        const contrat_garantie_gab_ = await getContratGarantieGabToNotify()

        const contrat_to_notify = {
            garantie:contrat_garantie_,
            maintenance:contrat_maintenance_,
            garantie_gab:contrat_garantie_gab_,
            maintenance_gab:contrat_maintenance_gab_,
        }

        const users = await user_to_notify()
        
        if(contrat_to_notify.garantie.length !== 0 || contrat_to_notify.garantie_gab.length !== 0 || contrat_to_notify.maintenance.length !== 0 || contrat_to_notify.maintenance_gab.length !== 0){
            const pdf_path = `./email_views/NOTIFICATION_CONTRAT_${moment().format('DD-MM-YYYY')}.pdf`
            printToPDF(contrat_to_notify,pdf_path)
            send_mail(users,pdf_path)
        }
        else{
            console.log("nothing to send ");
        }

        await updateAlarmStatutForMaintenance(contrat_maintenance_)
        await updateAlarmStatutForMaintenanceGab(contrat_maintenance_gab_)
        await updateAlarmStatutForGarantieGab(contrat_garantie_gab_)
        await updateAlarmStatutForGarantie(contrat_garantie_)

        // sendResponse(res,contrat_to_notify, "Liste de contrats à notifier")
    },
    updateAutoStatutContrat: async ()=> {
        await contrat_garantie_expired()
        await contrat_garantie_gab_expired()
        await contrat_maintenance_expired()
        await contrat_maintenance_gab_expired()
    },
 
}

//contrat  expired today, ceux qui ont date fin inferieur à today
    //all garantie except gab && update auto
    const contrat_garantie_expired = async(req,res,next)=>{   
        try {

            const expired = await contrat_garantie.findMany({
                where:{
                    contrat_garantie_detail:{
                        some:{
                            statut:"Valide",
                            date_fin : { lt : new Date (moment().subtract(1,'day')) }
                        }
                    }
                },
                include:{
                    contrat_garantie_detail:{
                        where:{
                            statut:"Valide",
                            date_fin : { lt : new Date (moment().subtract(1,'day')) }
                        },
                        include:{
                            equipement:{
                                include:{
                                    famille: {
                                        include:{
                                            service: true
                                        }
                                    },
                                    livraison:{
                                        include:{
                                            client:{
                                                include:{
                                                    ville:{
                                                        include:{
                                                            province:true
                                                        }
                                                    }
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

            if(expired){
                try {
                    const expired = await contrat_garantie_detail.updateMany({
                        where:{
                            statut:"Valide",
                            date_fin : { lt : new Date (moment().subtract(1,"day")) }
                        },
                        data:{
                            statut: "Expiré"
                        }
                    })
                } catch (error) {
                    console.log("error occured when updating contrat expired");
                }
            }

            // sendResponse(res, expired, "Liste de contrats expiré qui a été mise à jour recemment !")
        } catch (error) {
            console.log(error);
        }
    }

    //all maintenance except gab && update auto
    const contrat_maintenance_expired = async(req,res,next)=>{   
        try {

            const expired = await contrat_maintenance.findMany({
                where:{
                    statut:"Valide",
                    date_fin : { lt : new Date (moment().subtract(1,'day')) }
                },
                orderBy:{
                    date_fin:"asc"
                },
                include:{
                    client:{
                        include:{
                            ville:{
                                include:{
                                    province:true
                                }
                            }
                        }
                    },
                    contrat_maintenance_detail:{
                        include: {
                            equipement:{
                                include:{
                                    famille: {
                                        include:{
                                            service: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            if(expired){
                try {
                    const expired_updated = await contrat_maintenance.updateMany({
                        where:{
                            statut:"Valide",
                            date_fin : { lt : new Date (moment().subtract(1,'day')) }
                        },
                        data:{
                            statut:"Expiré",
                        }
                    })

                } catch (error) {
                    console.log(error);
                }
            }

            // sendResponse(res, expired, "Liste de contrats expiré qui a été mise à jour recemment !")
        } catch (error) {
            // next(error)
            console.log(error);
        }
    }
    
    //all maintenance_gab && update auto
    const contrat_maintenance_gab_expired = async(req,res,next)=>{
        try {

            const expired = await contrat_maintenance_gab.findMany({
                where:{
                    statut:"Valide",
                    date_fin : { lt : new Date (moment().subtract(1,'day')) }
                },
                orderBy:{
                    date_fin:"asc"
                },
                include:{
                    client:{
                        include:{
                            ville:{
                                include:{
                                    province:true
                                }
                            }
                        }
                    },
                    equipement:{
                        include:{
                            famille: {
                                include:{
                                    service: true
                                }
                            }
                        }
                    }
                }
            })

            if(expired){
                try {
                    const expired_updated = await contrat_maintenance_gab.updateMany({
                        where:{
                            statut:"Valide",
                            date_fin : { lt : new Date (moment().subtract(1,'day')) }
                        },
                        data:{
                            statut:"Expiré",
                        }
                    })

                } catch (error) {
                    console.log(error);
                }
            }

            // sendResponse(res, expired, "Liste de contrats maintenance gab expiré qui a été mise à jour recemment !")
        } catch (error) {
            // next(error)
            console.log(error);
        }
    }
    //all garantie_gab && update auto
    const contrat_garantie_gab_expired = async(req,res,next)=>{
        try {

            const expired = await contrat_garantie_gab.findMany({
                where:{
                    statut:"Valide",
                    date_fin : { lt : new Date (moment().subtract(1,'day')) }
                },
                orderBy:{
                    date_fin:"desc"
                },
                include:{
                    equipement:{
                        include:{
                            famille: {
                                include:{
                                    service: true
                                }
                            }
                        }
                    },
                    livraison:{
                        include:{
                            client:{
                                include:{
                                    ville:{
                                        include:{
                                            province:true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            if(expired){
                try {
                    const expired_updated = await contrat_garantie_gab.updateMany({
                        where:{
                            statut:"Valide",
                            date_fin : { lt : new Date (moment().subtract(1,'day')) }
                        },
                        data:{
                            statut:"Expiré",
                        }
                    })

                } catch (error) {
                    console.log(error);
                }
            }

            // sendResponse(res, expired, "Liste de contrats garantie gab expiré qui a été mise à jour recemment !")
        } catch (error) {
            // next(error)
            console.log(error);
        }
    }


const user_to_notify = async (req, res, next)=>{
   let users = []
    try {
 
        const email_user = await utilisateur.findMany({
            where: { is_envoie_rappel: true },
            select:{email:true}
        })

        email_user.forEach((user)=>{
            users.push(user.email)
        })

        return users
    } catch (error) {
        console.log(error);
    }
}

//get contrat garantie to notify
const getContratGarantieToNotify = async (req, res, next)=>{

    //date_aujourdhui
    const date_today = moment()

    //contrat_valide_non_notifie 
    try {
        const contrat_garantie_expiredIn45Days = await contrat_garantie.findMany({
            where:{
                contrat_garantie_detail:{
                    some:{
                        statut:"Valide",
                        is_alarmed_before:false,
                        date_alarm_before:{
                            lte:new Date(date_today)
                        }
                    }
                }
            },
            include:{
                livraison:{
                    include:{
                        client:{
                            include:{
                                ville:{
                                    include:{
                                        province:true
                                    }
                                }
                            }
                        }
                    }
                },
                contrat_garantie_detail:{
                    where:{
                        statut:"Valide",
                        is_alarmed_before:false,
                        date_alarm_before:{
                            lte:new Date(date_today)
                        }
                    }, 
                    include:{
                        equipement:{
                            include:{
                                famille: {
                                    include:{
                                        service: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        return contrat_garantie_expiredIn45Days
    } catch (error) {
        next(error)
    }
}
//HANDLE NOTIFICATION
const getContratMaintenanceToNotify = async (req, res, next) => {
        
    //date_aujourdhui
    const date_today = moment()
    //contrat_maintenance_valide_non_notifie 
    try {
        const  contrat_maintenance_valide_non_notifie = await contrat_maintenance.findMany({
            where:{
                statut:"Valide",
                is_alarmed_before:false,
                date_alarm_before:{
                    lte:new Date(date_today)
                }
            },
            orderBy:{
                date_fin:'asc'
            },
            include:{
                contrat_maintenance_detail:{
                    include:{
                        equipement:{
                            include:{
                                famille: {
                                    include:{
                                        service: true
                                    }
                                }
                            }
                        }
                    }
                },
                client:{
                    include:{
                        ville:{
                            include:{
                                province:true
                            }
                        }
                    }
                }
            }
        })

        return contrat_maintenance_valide_non_notifie
    } catch (error) {
        next(error)
    }
}
const getContratMaintenanceGabToNotify = async (req, res, next) => {
        
    //date_aujourdhui
    const date_today = moment()
    //contrat_maintenance_gab_valide_non_notifie 
    try {
        const  contrat_maintenance_gab_valide_non_notifie = await contrat_maintenance_gab.findMany({
            where:{
                statut:"Valide",
                is_alarmed_before:false,
                date_alarm_before:{
                    lte:new Date(date_today)
                }
            },
            orderBy:{
                date_fin:'desc'
            },
            include:{
                equipement:{
                    include:{
                        famille: {
                            include:{
                                service: true
                            }
                        }
                    }
                },
                client:{
                    include:{
                        ville:{
                            include:{
                                province:true
                            }
                        }
                    }
                }
            }
        })

        return contrat_maintenance_gab_valide_non_notifie
    } catch (error) {
        next(error)
    }
}
const getContratGarantieGabToNotify = async (req, res, next) => {
        
    //date_aujourdhui
    const date_today = moment()
    //contrat_maintenance_gab_valide_non_notifie 
    try {
        const  contrat_garantie_gab_valide_non_notifie = await contrat_garantie_gab.findMany({
            where:{
                statut:"Valide",
                is_alarmed_before:false,
                date_alarm_before:{
                    lte:new Date(date_today)
                }
            },
            orderBy:{
                date_fin:'desc'
            },
            include:{
                equipement:{
                    include:{
                        famille: {
                            include:{
                                service: true
                            }
                        }
                    }
                },
                livraison:{
                    include:{
                        client:{
                            include:{
                                ville:{
                                    include:{
                                        province:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        return contrat_garantie_gab_valide_non_notifie
    } catch (error) {
        // next(error)
        console.log(error);
    }
}

//update => set as alarmed after notified
//update for maintenance 
const updateAlarmStatutForMaintenance = async(maintenanceArray=[])=>{
    if(maintenanceArray.length !==0 ){
        let array_of_id_maintenance = []
        maintenanceArray?.map((contrat)=>{
            array_of_id_maintenance.push(+contrat.id)
        })
        try {
            const updatedStatut = await contrat_maintenance.updateMany({
                where: { 
                    id : { in : array_of_id_maintenance }
                },
                data:{
                    is_alarmed_before:true,
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

//update for maintenance_gab
const updateAlarmStatutForMaintenanceGab = async(maintenanceGabArray=[])=>{
    if(maintenanceGabArray.length !==0 ){
        let array_of_id_maintenance_gab = []
        maintenanceGabArray?.map((contrat)=>{
            array_of_id_maintenance_gab.push(+contrat.id)
        })
        try {
            const updatedStatut = await contrat_maintenance_gab.updateMany({
                where: { 
                    id : { in : array_of_id_maintenance_gab }
                },
                data:{
                    is_alarmed_before:true,
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

//update for garantie_gab
const updateAlarmStatutForGarantieGab = async(garantieGabArray=[])=>{
    if(garantieGabArray.length !==0 ){
        let array_of_id_garantie_gab = []
        garantieGabArray?.map((contrat)=>{
            array_of_id_garantie_gab.push(+contrat.id)
        })
        try {
            const updatedStatut = await contrat_garantie_gab.updateMany({
                where: { 
                    id : { in : array_of_id_garantie_gab }
                },
                data:{
                    is_alarmed_before:true,
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

//update for garantie
const updateAlarmStatutForGarantie = async(garantieArray=[])=>{
    if(garantieArray.length !==0 ){
        let array_of_id_contrat_garantie_detail = []
        garantieArray?.map((garnatie,index)=>{
            garnatie.contrat_garantie_detail?.map((detail)=>{
                array_of_id_contrat_garantie_detail.push(+detail.id)
            })
        })
        
        try {
            const updatedStatut = await contrat_garantie_detail.updateMany({
                where: { 
                    id : { in : array_of_id_contrat_garantie_detail }
                },
                data:{
                    is_alarmed_before:true,
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}



//GET ALL THE CONTRAT EXPIREE IN 45 days
const getContratGarantieExpiredIn45Days = async (req, res, next)=>{

    //date_aujourdhui
    const date_today = moment().format('YYYY-MM-DD')

    //contrat_valide_non_notifie 
    try {
        const contrat_garantie_expiredIn45Days = await contrat_garantie.findMany({
            where:{
                contrat_garantie_detail:{
                    some:{
                        statut:"Valide",
                        date_alarm_before:{
                            equals: new Date(date_today)
                        }
                    }
                }
            },
            include:{
                livraison:{
                    include:{
                        client:{
                            include:{
                                ville:{
                                    include:{
                                        province:true
                                    }
                                }
                            }
                        }
                    }
                },
                contrat_garantie_detail:{
                    where:{
                        statut:"Valide",
                        date_alarm_before:new Date(date_today)
                    }, 
                    include:{
                        equipement:{
                            include:{
                                famille: {
                                    include:{
                                        service: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        return contrat_garantie_expiredIn45Days
    } catch (error) {
        console.log(error);
        // next(error)
    }
}

const getContratGarantieGabExpiredIn45Days= async (req, res, next) => {
        
    //date_aujourdhui
    const date_today = moment().format('YYYY-MM-DD')
    //contrat_maintenance_gab_valide_non_notifie 
    try {
        const  contrat_garantie_gab_expired_in_45_days = await contrat_garantie_gab.findMany({
            where:{
                statut:"Valide",
                date_alarm_before:{
                    equals: new Date(date_today)
                }
            },
            orderBy:{
                date_fin:'desc'
            },
            include:{
                equipement:{
                    include:{
                        famille: {
                            include:{
                                service: true
                            }
                        }
                    }
                },
                livraison:{
                    include:{
                        client:{
                            include:{
                                ville:{
                                    include:{
                                        province:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        return contrat_garantie_gab_expired_in_45_days
    } catch (error) {
        // next(error)
        console.log(error);
    }
}

const getContratMaintenanceExpiredIn45Days = async (req, res, next) => {
        
    //date_aujourdhui
    const date_today = moment().format('YYYY-MM-DD')
    //contrat_maintenance_valide_non_notifie 
    try {
        const  contrat_maintenance_valide_expired_in_45_days = await contrat_maintenance.findMany({
            where:{
                statut:"Valide",
                date_alarm_before:{
                    equals: new Date(date_today)
                }
            },
            orderBy:{
                date_fin:'desc'
            },
            include:{
                contrat_maintenance_detail:{
                    include:{
                        equipement:{
                            include:{
                                famille: {
                                    include:{
                                        service: true
                                    }
                                }
                            }
                        }
                    }
                },
                client:{
                    include:{
                        ville:{
                            include:{
                                province:true
                            }
                        }
                    }
                }
            }
        })

        return contrat_maintenance_valide_expired_in_45_days
    } catch (error) {
        console.log(error);
    }
}

const getContratMaintenanceGabExpiredIn45Days = async (req, res, next) => {
        
    //date_aujourdhui
    const date_today = moment().format('YYYY-MM-DD')
    //contrat_maintenance_gab_valide_non_notifie 
    try {
        const  contrat_maintenance_gab_expired_in_45_days = await contrat_maintenance_gab.findMany({
            where:{
                statut:"Valide",
                date_alarm_before:{
                    equals: new Date(date_today)
                }
            },
            orderBy:{
                date_fin:'desc'
            },
            include:{
                equipement:{
                    include:{
                        famille: {
                            include:{
                                service: true
                            }
                        }
                    }
                },
                client:{
                    include:{
                        ville:{
                            include:{
                                province:true
                            }
                        }
                    }
                }
            }
        })

        return contrat_maintenance_gab_expired_in_45_days
    } catch (error) {
        console.log(error)
    }
}


//get contrat pour l'annee courant
//get for the maintenance
const getContratMaintenanceGabForThisYear = async (req, res, next) => {
        
    //date_aujourdhui
    const debut_annee = moment().startOf('year').format('YYYY-MM-DD')
    const fin_annee = moment().endOf('year').format('YYYY-MM-DD')

    //contrat_maintenance_valide_non_notifie 
    try {
        const  contrat_maintenance_gab_for_this_year = await contrat_maintenance_gab.count({
            where:{
                date_debut:{
                    gte:new Date(debut_annee)
                },
                date_fin:{
                    lte: new Date(fin_annee)
                }
            }
        })

        return contrat_maintenance_gab_for_this_year
    } catch (error) {
        console.log(error);
    }
}
//get for the maintenance
const getContratMaintenanceForThisYear = async (req, res, next) => {
        
    //date_aujourdhui
    const debut_annee = moment().startOf('year').format('YYYY-MM-DD')
    const fin_annee = moment().endOf('year').format('YYYY-MM-DD')
    //contrat_maintenance_valide_non_notifie 
    try {
        const  contrat_maintenance_for_this_year = await contrat_maintenance.count({
            where:{
                date_debut:{
                    gte:new Date(debut_annee)
                },
                date_fin:{
                    lte: new Date(fin_annee)
                }
            }
        })

        return contrat_maintenance_for_this_year
    } catch (error) {
        console.log(error);
    }
}
const getContratGarantieGabForThisYear = async (req, res, next) => {
        
    //date_aujourdhui
    const debut_annee = moment().startOf('year').format('YYYY-MM-DD')
    const fin_annee = moment().endOf('year').format('YYYY-MM-DD')
    //contrat_maintenance_valide_non_notifie 
    try {
        const  contrat_garantie_gab_for_this_year = await contrat_garantie_gab.count({
            where:{
                date_installation:{
                    gte:new Date(debut_annee)
                },
                date_fin:{
                    lte: new Date(fin_annee)
                }
            }
        })

        return contrat_garantie_gab_for_this_year
    } catch (error) {
        console.log(error);
    }
}
const getContratGarantieForThisYear = async (req, res, next) => {
        
    //date_aujourdhui
    const debut_annee = moment().startOf('year').format('YYYY-MM-DD')
    const fin_annee = moment().endOf('year').format('YYYY-MM-DD')


    //contrat_maintenance_valide_non_notifie 
    try {
        const  contrat_garantie_for_this_year = await contrat_garantie.count({
            where:{
                contrat_garantie_detail:{
                    some:{
                        date_debut:{
                            gte:new Date(debut_annee)
                        },
                        date_fin:{
                            lte: new Date(fin_annee)
                        }
                    }
                }
            }
        })

        return contrat_garantie_for_this_year
    } catch (error) {
        console.log(error);
    }
}

