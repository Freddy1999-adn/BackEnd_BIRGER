const joi = require('@hapi/joi');

module.exports = {
    validate_update_contrat: (data) => {
        const schema = joi.object({
            num_contrat:joi.string().required(),
            description: joi.string(),
            date_proposition: joi.string()
        })

        return schema.validate(data)
    }
}
