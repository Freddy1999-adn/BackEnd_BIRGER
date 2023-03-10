const joi = require('@hapi/joi');

module.exports = {
    validate_create: (data) => {
        const schema = joi.object({
            equipement:joi.object().required(),
            site_installation: joi.string().required(),
            date_installation: joi.any().required(),
            observation: joi.any()

        })
        return schema.validate(data)
    }
}
