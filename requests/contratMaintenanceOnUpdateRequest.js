const joi = require('@hapi/joi');

module.exports = {
    validate_update_contrat: (data) => {
        const schema = joi.object({
            num_contrat:joi.string().required(),
            num_facture:joi.any(),
            date_debut: joi.any().required(),
            date_facture: joi.any(),
            date_proposition: joi.any(),
            observation: joi.any(),
            client_id: joi.number().required(),
            equipement_id: joi.array().required(),
            redevance_totale: joi.any()
        })

        return schema.validate(data)
    }
}
