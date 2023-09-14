const crypto = require("crypto");

function generateMD5String(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

module.exports = {
  generateMD5String,
};
