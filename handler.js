'use strict';
const DynamoDB = require("aws-sdk/clients/dynamodb")
const documentClient = new DynamoDB.DocumentClient({
  region: 'us-east-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000
  }

})
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data)
  }
}

module.exports.createNote = async (event, context, callback) => {
  // context.callbackWaitsForEmptyEventLoop = false //proveri sta ovo radi, trebalo bi ici u svaku fju
  let data = JSON.parse(event.body); //ono sto prosledjujemo POST zahtevu
  try{
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(notesId)" //ako nema id-a da throw-uje
    }
    await documentClient.put(params).promise();
    callback(null, send(201, data))
  } catch(err) {
    callback(null, send(500, JSON.stringify(err.message)))
  }
  
}

module.exports.updateNote = async (event, context, callback) => {
  let notesId = event.pathParameters.id //iz URL cita id...
  let data = JSON.parse(event.body)
  try{
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {notesId},
      UpdateExpression: 'set #title= :title, #body = :body', //kul rstva
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body
      },
      ConditionExpression: 'attribute_exists(notesId)'
    }

    await documentClient.update(params).promise()
    callback(null, send(200, data))

  } catch(err) {
    callback(null, send(500, err.message))
  }

}

module.exports.deleteNote = async (event, context, callback) => {
  let notesId = event.pathParameters.id //iz URL cita id...
  try{
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {notesId},
      ConditionExpression: 'attribute_exists(notesId)'
    }

    await documentClient.delete(params).promise()
    callback(null, send(200, notesId))

  } catch(err) {
    callback(null, send(500, err.message))
  }

}

module.exports.getAllNotes = async (event, context, callback) => {
  try{
    const params = {
      TableName: NOTES_TABLE_NAME,
    }

    const notes = await documentClient.scan(params).promise()
    callback(null, send(200, notes))

  } catch(err) {
    callback(null, send(500, err.message))
  }

}
