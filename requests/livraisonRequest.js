const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.number(),
            date_livraison: joi.any().required(),
            date_facture: joi.any(),
            num_bon_livraison: joi.string().required(),
            num_facture: joi.any(),
            observation: joi.any(),
            client: joi.any().required(),
            equipement: joi.any().required()
        })

        return schema.validate(data)
    }
}
