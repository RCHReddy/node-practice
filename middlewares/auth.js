const adminAuth = (req, res, next) => {
    const isAdmin = true; // Replace with actual authentication logic
    if (isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
};

const userAuth = (req, res, next) => {
    const isAuthenticated = true; // Replace with actual authentication logic
    if (isAuthenticated) {
        next();                             
    } else {
        res.status(401).json({ message: "Unauthorized. Please log in." });
    }
};

module.exports = {adminAuth, userAuth};          