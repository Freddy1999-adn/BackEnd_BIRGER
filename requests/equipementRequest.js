const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.number(),
            num_serie: joi.string().required(),
            marque: joi.string().required(),
            modele: joi.string().required(),
            duree_garantie:joi.any(),
            redevance_contrat: joi.any(),
            is_locale: joi.boolean().required(), 
            famille: joi.number().required(),
            service: joi.any(),
            fournisseur: joi.any()
        })

        return schema.validate(data)
    }
}
