const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            id: joi.number(),
            nom_province: joi.string().required()
        })

        return schema.validate(data)
    }
}
