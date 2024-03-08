const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    // MongoDB get invalid id
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

export default errorHandler;
