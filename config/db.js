const mongoose = require("mongoose");
const variables = require("./vars");

//building connection link
function getConnectionLink() {
  let link = "mongodb://";
  link +=
    variables.database.host +
    ":" +
    variables.database.port +
    "/" +
    variables.database.database;

  return link;
}

module.exports.load = function () {
  mongoose.connect(getConnectionLink(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.Promise = global.Promise;
};
