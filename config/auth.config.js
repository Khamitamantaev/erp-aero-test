module.exports = {
    access_secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    refresh_secret: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    jwtExpiration: process.env.NODE_ENV === 'development' ? 60 : 600,
    jwtRefreshExpiration: process.env.NODE_ENV === 'development' ? 120 : 20000,
};