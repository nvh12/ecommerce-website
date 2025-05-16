const cloudinary = require('../utils/cloudinary');

function streamUpload(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

const uploadToCloud = async (req, res, next) => {
  try {
    const files = req.files || [];
    const uploadedLinks = [];

    // Upload tất cả ảnh, đợi upload xong từng cái
    for (const file of files) {
      const url = await streamUpload(file.buffer);
      uploadedLinks.push(url);
    }

    // Gộp với ảnh link sẵn có trong req.body.images (nếu là chuỗi thì chuyển thành mảng)
    let links = req.body.images || [];
    if (typeof links === 'string') links = [links];

    req.body.images = [...links, ...uploadedLinks];

    next();
  } catch (error) {
    console.error('Upload middleware error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {uploadToCloud};
