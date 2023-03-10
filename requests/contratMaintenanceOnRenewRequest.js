const joi = require('@hapi/joi');

module.exports = {
    validate_renew: (data) => {
        const schema = joi.object({
            date_debut: joi.any().required(),
            equipement_id: joi.array().required(),
            duree_renouvellement: joi.number().required()
        })

        return schema.validate(data)
    }
}
