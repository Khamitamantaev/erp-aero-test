module.exports = {
    access_secret: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    refresh_secret: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    jwtExpiration: 60,          // 1 minute
    jwtRefreshExpiration: 120,  // 2 minutes
};