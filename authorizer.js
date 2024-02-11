const { CognitoJwtVerifier } = require("aws-jwt-verify"); //handles JWT

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_8f4h2GgVw",
    tokenUse: "id",
    clientId: "2l90en0d1dvdpr7lp4emj7caog"
})

const generatePolicy = (principalId, effect, resource) => {
    var authResponse = {}
    
    authResponse.principalId = principalId;

    if(effect && resource){
        let policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke"
                }
            ]
        }
        authResponse.policyDocument = policyDocument
    }
    
    authResponse.context = {
        foo: "bar" //random example
    }

    console.log(JSON.stringify(authResponse));
    return authResponse
}

exports.handler = async (event, context, callback) => {
    let token = event.authorizationToken //allow or deny...
    console.log(token);

    try{
        const payload = await jwtVerifier.verify(token);
        console.log(JSON.stringify(payload))
        callback(null, generatePolicy("user", "allow", event.methodArn));
    } catch(err) {
        callback("Error: Invalid token")
    }

    // switch(token){
    //     case "allow":
    //         callback(null, generatePolicy("user", "allow", event.methodArn))
    //         break;
    //     case "deny":
    //         callback(null, generatePolicy("user", "deny", event.methodArn))
    //         break;
    //     default:
    //         callback("Error: invalid token")
    //         break;
    // }
}