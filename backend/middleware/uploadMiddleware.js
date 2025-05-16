const multer = require('multer');

// Lưu file vào bộ nhớ RAM 
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = {upload};
