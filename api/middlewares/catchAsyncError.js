// module.exports = func => (req, res, next) => {
//         return Promise.resolve(func(req, res, next)).catch(next)
// }

const catchAsyncError = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};

export default catchAsyncError;
