'use strict';
const AWS = require('aws-sdk');

AWS.config.update({
    region:'localhost',
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
  });

  let dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  //  accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
   //secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
})
  
//let dynamo = new AWS.DynamoDB.DocumentClient();

require('aws-sdk/clients/apigatewaymanagementapi');

const CHATCONNECTION_TABLE = 'chatIdTable';

const successfullResponse = {
    statusCode: 200,
    body: 'everything is alright'
};

module.exports.handler = (event, context, callback) => {
    console.log(event);

    if (event.requestContext.eventType === 'CONNECT') {
        // Handle connection
        addConnection(event.requestContext.connectionId)
            .then(() => {
                callback(null, successfullResponse);
            })
            .catch(err => {
                console.log(err);
                callback(null, JSON.stringify(err));
            });
    } else if (event.requestContext.eventType === 'DISCONNECT') {
        // Handle disconnection
        deleteConnection(event.requestContext.connectionId)
            .then(() => {
                callback(null, successfullResponse);
            })
            .catch(err => {
                console.log(err);
                callback(null, {
                    statusCode: 500,
                    body: 'Failed to connect: ' + JSON.stringify(err)
                });
            });
    }
};
const addConnection = connectionId => {
    const params = {
        TableName: CHATCONNECTION_TABLE,
        Item: {
            connectionId: connectionId
        }
    };

    return dynamo.put(params).promise();
};

const deleteConnection = connectionId => {
    const params = {
        TableName: CHATCONNECTION_TABLE,
        Key: {
            connectionId: connectionId
        }
    };

    return dynamo.delete(params).promise();
};