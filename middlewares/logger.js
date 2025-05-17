module.exports.Logger = (req, res, next)=>{
    const url =  req.url;
    const date = new Date().getDate();
    console.log(`[${date}] - ${req.method} request to ${url}`);
    next();
}