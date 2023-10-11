//First is notFound. This will be called if no other middleware has handled the request.
//This will create a new error object, and set the code to 404 (not found).

const notFound = (req, res, next) => {
const error = new Error(`Not Found - ${req.originalUrl}`);
res.status(404);
next(error);
};

//Overwrite the default Express error handler function.

const errorHandler = (err, req, res, next) => {
let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
let message = err.message;


//Check for Mongoose bad ObjectId

if (err.name === "CastError" && err.kind === "ObjectId") {
  message = "Resource not found!";
  statusCode = 404;
}

//Final response by passing in statusCode

res.status(statusCode).json({
  message,
  stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
})
}

export { notFound, errorHandler };