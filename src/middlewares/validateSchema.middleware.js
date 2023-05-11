export function validateSchema(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(400).json({ errors });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Campo 'name' é obrigatório." });
    }

    next();
  };
}
