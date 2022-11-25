import Joi from "joi";

export const requestValidation = async (body) => {
  const schemaQuery = {
    api_action: Joi.number().valid(1, 2, 3, 4, 5, 6).required(),
    client_id: Joi.number().integer().positive().required(),
    blocklist_id: Joi.number().integer().positive().required(),
    files: Joi.array().items({
      base64_string: Joi.string().required(),
      file_type: Joi.string().required(),
      file_name: Joi.string().required(),
    }),
    file: Joi.object({
      base64_string: Joi.string().required(),
      file_type: Joi.string().required(),
      file_name: Joi.string().required(),
    }),
  };

  const schema = Joi.object(schemaQuery);

  try {
    await schema.validateAsync(body);
  } catch (err) {
    throw new Error(err.message);
  }
};
