const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.number(),
            nom_client: joi.string().required(),
            adresse: joi.any(),
            email: joi.any(), 
            tel: joi.any(),
            ville: joi.number(),
        })

        return schema.validate(data)
    }
}
