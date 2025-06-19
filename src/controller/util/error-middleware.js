import { HttpStatus } from "./httpStatus.js";
export const errorMiddleware = (err, req, res, next) => {
	res.status(err.status ?? HttpStatus.BAD_REQUEST);
	res.render("error", {
		error: err,
		message: err.message,
		status: err.status ?? HttpStatus.BAD_REQUEST,
	});
	res.end();
};
