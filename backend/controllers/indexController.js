const { Brand, Category } = require("../models/index");
const { findBrand, findCategory } = require("../services/indexService");

// Controller để tìm brand
const findBrandControl = async (req, res) => {
  try {
    const brandFound = await findBrand();  // Đặt lại biến ở đây để tránh lỗi
    if (!brandFound || brandFound.length === 0) { // Kiểm tra nếu không có brand nào
      return res.status(404).json({ message: "Không có brand nào" });
    }
    res.status(200).json({ message: "Success", brandFound });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tìm brand", error: err.message });
  }
};

// Controller để tìm category 
const findCategoryControl = async (req, res) => {
  try {
    const categoryFound = await findCategory();
    if (!categoryFound || categoryFound.length === 0) {
      return res.status(404).json({ message: "Không có category nào" });
    }
    res.status(200).json({ message: "Success", categoryFound });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tìm category", error: err.message });
  }
};

module.exports = {
  findBrandControl,
  findCategoryControl
};
