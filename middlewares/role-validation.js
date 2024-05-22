exports.isCustomer = async (req,res, next) => {
    console.log(req.user.role)

    if(req.user.role == "customer"){
        next()
    } else {
        return res.status(401).json ({
            succsess : false,
            auth: false,
            message: `Forbiden! Not a customer`
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    if(req.user.role == "admin") {
        next()
    } else {
        return res.json ({
            succsess : false,
            auth: false,
            message: `Forbiden! Not an admin`
        })
    }
}