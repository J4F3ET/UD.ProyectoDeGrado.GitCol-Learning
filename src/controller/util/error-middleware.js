export const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status);
    res.render("error", { error: err, message: err.message, status});
    res.end();
}