const joi = require('@hapi/joi');

module.exports = {
    validate: (data) => {
        const schema = joi.object({
            nom: joi.string().required(),
            pseudo:joi.string().required(),
            email: joi.string().required(),
            tel: joi.any(),
            is_envoie_rappel: joi.boolean().required(),
            is_admin: joi.boolean().required(),
            image_path: joi.any()
        })

        return schema.validate(data)
    }
}
