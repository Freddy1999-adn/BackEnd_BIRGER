const joi = require('@hapi/joi');

module.exports = {
    validate_create: (data) => {
        const schema = joi.object({
            num_contrat:joi.string().required(),
            observation: joi.any(),
            livraison_id: joi.number().required()
        })

        return schema.validate(data)
    }
}
