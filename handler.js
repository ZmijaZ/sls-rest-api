'use strict';

module.exports.createNote = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify("New note created"),
  };

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
