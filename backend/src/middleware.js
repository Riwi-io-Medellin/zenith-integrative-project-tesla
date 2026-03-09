const isLoged = (req, res, next) => {

    const userId = req.cookies.user_session;

    if(userId){

        req.userId = userId;
        return next();

    }else{

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({ message: "Unauthorized: Session expired" });
        }

        return res.redirect("/");

    }
}

const isGuest = (req, res, next) => {

    const userSession = req.cookies.user_session;

    if(userSession){

        return res.redirect("/dashboard")

    }else{

        return next()

    }
}

export {isLoged, isGuest}