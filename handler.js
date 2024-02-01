'use strict';
const DynamoDB = require("aws-sdk/clients/dynamodb")
const documentClient = new DynamoDB.DocumentClient({region: 'us-east-1'})


module.exports.createNote = async (event, context, callback) => {
  let data = JSON.parse(event.body); //ono sto prosledjujemo POST zahtevu
  try{
    const params = {
      TableName: "notes",
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(notesId)" //ako nema id-a da throw-uje
    }
    await documentClient.put(params).promise();
    callback(null, {
      statusCode: 201,
      body: JSON.stringify(data)
    })
  } catch(err) {
    callback(null, {
      statuscode: 500,
      body: JSON.stringify(err.message)
    })
  }
  

}

module.exports.updateNote = async (event) => {
  let notesId = event.pathParameters.id //iz URL cita id...
  return {
    statusCode: 200,
    body: JSON.stringify("Updated note " + notesId),
  };

}

module.exports.deleteNote = async (event) => {
  let notesId = event.pathParameters.id
  return {
    statusCode: 200,
    body: JSON.stringify("Deleted note " + notesId),
  };

}

module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("All notes fetched"),
  };

}
