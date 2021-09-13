'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}
/*
Custom function to insert the executed Journey Data into a MC Data Extension
*/

function insertDE(subscriberKey, emailAddress) {
    var FuelSoap = require(Path.join(__dirname, '..', 'lib', 'fuel-soap.js'));

    console.log("process.env.clientId: " + process.env.clientId);
    console.log("process.env.clientSecret: " + process.env.clientSecret);
    var options = {
        auth: {
            clientId: process.env.clientId, 
            clientSecret: process.env.clientSecret,
            authVersion: 2,
            authUrl: "https://mccm513slg7yqpvrqxd0phfqlw18.auth.marketingcloudapis.com/v2/token",
            accountId: process.env.accountId
        },
        soapEndpoint: 'https://mccm513slg7yqpvrqxd0phfqlw18.soap.marketingcloudapis.com/Service.asmx' // default --> https://webservice.exacttarget.com/Service.asmx        
    };

    //var SoapClient = new FuelSoap(options);
    //console.log('Soap Client: '+SoapClient);

    const axios = require('axios');
   
    // try {
        let response = axios.post(
            'https://mccm513slg7yqpvrqxd0phfqlw18.auth.marketingcloudapis.com/v2/token',
            {
                data:{
                    client_id: 'sdlxq36utr991wy1z5cdq2iq',
                    client_secret: 'j1HXzHEWUn2mgVNjat3gY3Ag',
                    grant_type: 'client_credentials'
                }
            }
        ).then(response =>{
            console.log('Access Token Response: '+ response);
        })
        .catch(function (error) {
            console.log(error);
        });
        // console.log('Access Token Response: '+ response);
    // } catch (error) {
    //     console.log('Error occured while authorizing MC: '+ error.message);
    // }



    var co = {
        "CustomerKey": "Custom_JB_Activity_Dipshi",
        "Keys":[
                {
                    "Key":
                    {
                        "Name":"SubscriberKey",
                        "Value": subscriberKey 
                    }
                }
            ],
            Properties: {
                Property: [
                    {
                        Name: "EmailAddress",
                        Value: emailAddress
                    },
                    {
                        Name: "Text",
                        Value: "Test Test"
                    }
                ]
            }
    };

    // var uo = {
    //     SaveOptions: [{"SaveOption":{PropertyName:"DataExtensionObject",SaveAction:"UpdateAdd"}}]
    // };

    // SoapClient.update('DataExtensionObject',co,uo, function(err, response){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log(response.body.Results);
    //     }
    // });
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
            // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
            
            logData(req);
            console.log('decodedArgs: ' + JSON.stringify(decodedArgs));

            insertDE(decodedArgs.subscriberKey, decodedArgs.emailAddress);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};
