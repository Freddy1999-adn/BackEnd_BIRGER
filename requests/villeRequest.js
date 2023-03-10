const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.number(),
            nom_ville: joi.string().required(),
            province_id: joi.number().required()
        })

        return schema.validate(data)
    }
}
