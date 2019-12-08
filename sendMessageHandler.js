'use strict';
const AWS = require('aws-sdk');
//let dynamo = new AWS.DynamoDB.DocumentClient();
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
const CHATCONNECTION_TABLE = 'chatIdTable';

require('aws-sdk/clients/apigatewaymanagementapi');
module.exports.handler = (event, context, callback) => {
    sendMessageToAllConnected(event).then(() => {
      callback(null, successfullResponse)
    }).catch (err => {
      callback(null, JSON.stringify(err));
    });
  }
  
  const sendMessageToAllConnected = (event) => {
    return getConnectionIds().then(connectionData => {
      return connectionData.Items.map(connectionId => {
        return send(event, connectionId.connectionId);
      });
    });
  }
  
  const getConnectionIds = () => {  
    const params = {
      TableName: CHATCONNECTION_TABLE,
      ProjectionExpression: 'connectionId'
    };
  
    return dynamo.scan(params).promise();
  }
  
  const send = (event, connectionId) => {
    const body = JSON.parse(event.body);
    const postData = body.data;  
  
    const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      //endpoint: endpoint
      endpoint: 'http://localhost:3001',
    });
  
    const params = {
      ConnectionId: connectionId,
      Data: postData
    };
    return apigwManagementApi.postToConnection(params).promise();
  };