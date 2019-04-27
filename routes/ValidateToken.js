var request = require('request');

function validateToken(req, res,next) {
    // call api untuk validate
    var token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ respCode: '3' ,message: 'No token provided.' });
    }
    request( {
        url: 'http://localhost:14101/api/auth/validate',
        method: 'GET',
        headers : { "x-access-token" : token }
    },
    function(error, response, body) {
        if(!error && response.statusCode==200){
            next();
        }else{
            response = JSON.parse(body);
            res.send(response);
        }
    });
};
module.exports = validateToken;