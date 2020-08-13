module.exports.tokenUtils = {
    getToken: () => {
        return Buffer.from(Date.now() + '').toString('base64')
    },

    isTokenValid: token => {
        try {
            const tokenString = Buffer.from(token, 'base64').toString('utf-8');
            const millis = Date.now() - tokenString;
            const timeElapsed = Math.floor(millis / 1000)
            return timeElapsed < 3600
        } catch (e) {
            return false
        }
    }
}
