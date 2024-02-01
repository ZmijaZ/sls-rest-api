'use strict';

module.exports.createNote = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("New note created"),
  };

}
