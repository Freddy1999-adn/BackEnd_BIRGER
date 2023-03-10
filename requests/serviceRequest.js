const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.number(),
            nom_service: joi.string().required(),
            description: joi.any()
        })

        return schema.validate(data)
    }
}
