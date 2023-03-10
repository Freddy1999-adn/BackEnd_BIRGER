const joi = require('@hapi/joi');

module.exports = {
    validate_contrat_detail: (data) => {
        const schema = joi.object({
            date_debut: joi.any().required(),
            contrat_id: joi.number().required(),
            equipement_id: joi.number().required()
        })

        return schema.validate(data)
    }
}
