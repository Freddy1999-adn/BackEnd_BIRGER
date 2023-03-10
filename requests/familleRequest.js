const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.number(),
            nom_famille: joi.string().required(),
            service_id: joi.number().required()
        })

        return schema.validate(data)
    }
}
