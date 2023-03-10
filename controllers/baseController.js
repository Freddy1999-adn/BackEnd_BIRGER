//on front : just check the status (failed | success) and show the message occured
module.exports = {
    sendResponse: (res, data, message, status, statusCode=200) => {
        return res.status(statusCode).json({
            "status": status || "success", 
            "message": message || "Un action a été éffectué avec succès",
            "data": data 
        });
    }, 

    sendError: (res, message, status, statusCode=400) => {
        return res.status(statusCode).json({
            "status": status || "failed", 
            "message": message || "Une erreur est survenue lors de l'operation",
            "data": null
        });
    }, 
}