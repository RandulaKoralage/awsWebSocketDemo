const AWS = require('aws-sdk');

require('aws-sdk/clients/apigatewaymanagementapi');
module.exports.handler = (event, context, callback) => {
    console.log('defaultHandler was called');
    console.log(event);
  
    callback(null, {
      statusCode: 200,
      body: 'defaultHandler'
    });
  };