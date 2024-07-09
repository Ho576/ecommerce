import Joi from "joi";

export const deleteCategorySchema = Joi.object({
    id:Joi.string().hex.length(24),
});