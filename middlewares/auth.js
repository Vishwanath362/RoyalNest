const secret = "blindhope32"
const checkIfLoggedIn = async (req,res,next)=>{
    const user = req.session.user || null;

    if(!user) {
        return res.redirect('/login');
    }
    next();
}

module.exports = {checkIfLoggedIn}