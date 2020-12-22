// Handler function to wrap the routes
exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch(error) {
            // Pass the error to the global error handler
            next(error);
        }
    }
}