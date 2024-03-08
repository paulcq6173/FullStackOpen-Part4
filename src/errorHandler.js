const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  switch (error.name) {
    case "CastError":
      // MongoDB get invalid id
      return response.status(400).send({ error: "malformatted id" });
    case "ValidationError":
      // MongoDB Validation error: The Data doesn't match the SchemaOptions
      return response.status(400).json({ error: error.message });
  }

  next(error);
};

export default errorHandler;
