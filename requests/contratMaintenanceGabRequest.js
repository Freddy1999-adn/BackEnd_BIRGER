const joi = require('@hapi/joi');

module.exports = {
    validate_create: (data) => {
        const schema = joi.object({
            //contrat maintenance gab
            date_debut: joi.any().required(),
            site_installation:joi.string().required(),
            redevance_totale : joi.number(),
            date_proposition: joi.any(),
            observation: joi.any(),
            client_id: joi.number().required(),
            equipement_id: joi.number().required(),
            redevance: joi.array().required()
            
        })

        return schema.validate(data)
    }
}
