import Joi from "joi";

export const userSchemaValidator = Joi.object({
    email: Joi.string().email().required(),
    optCode: Joi.string().required(),
});

export const kontragentSchemaValidator = Joi.object({
    ownershipForm: Joi.string().required().label("Ownership Form"),

    inn: Joi.string().when("ownershipForm", {
        is: Joi.string().valid("Юридическое лицо", "Юридическое лицо, обособленное подразделение"),
        then: Joi.required(),
        otherwise: Joi.optional()
    }).length(9).label("INN"),

    pinfl: Joi.string().when("ownershipForm", {
        is: Joi.string().valid("Индивидуальный предприниматель"),
        then: Joi.required(),
        otherwise: Joi.optional()
    }).length(14).label("PINFL"),

    oked: Joi.string().required().length(5).label("OKED"),
    name: Joi.string().required().label("Name"),
    legalAddress: Joi.string().required().label("Legal Address"),

    isFavorite: Joi.boolean().optional().default(false).label("Is Favorite"),

    countryOfRegistration: Joi.string().when("ownershipForm", {
        is: Joi.string().regex(/нерезидент/i),
        then: Joi.required(),
        otherwise: Joi.optional()
    }).label("Country Of Registration")
});
