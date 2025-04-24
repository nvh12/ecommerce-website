const Rating = require("../models/rating")
const Product = require("../models/product")
const mongoose = require("mongoose")

const createRating = async (userId , productID, rating) => {
    try{
        
        const check = await Rating.findOne({
            user:new mongoose.Types.ObjectId(userId),
            product:new mongoose.Types.ObjectId(productID)
        })
        
        if (check){
            return await updateRating(check._id, rating)
        }
        else{
            const newRating = await Rating.create({
                user:new mongoose.Types.ObjectId(userId),
                product:new mongoose.Types.ObjectId(productID),
                rate: rating})
            if(newRating){
                // Xu ly san pham khi co them rating moi
                const product = await Product.findById( new mongoose.Types.ObjectId(productID))
                if(product){
                    //Them so rating va tinh la tb rating
                    const newCount = product.ratingsCount.total + 1
                    product.ratingsAvg = parseFloat((product.ratingsAvg * product.ratingsCount.total + rating)/ newCount).toFixed(1)
                    product.ratingsCount.total  = newCount
                    product.ratingsCount[parseInt(rating)]++
                    await product.save()
                }
                else{
                    throw new Error("Can not find product to rate")
                }
            }
            else{
                throw new Error("Can not create new ratingFound")
            }
            return newRating
        }
    }
    catch(err){
        throw err
    }
}

const getRatingProduct = async (productId, userId = null, allRating = true) => {
    try{
        let ratingFound
        if (allRating=== true){
            ratingFound = await Rating.find({
                product: new mongoose.Types.ObjectId(productId)
            }).lean()
        }
        else {
            if (!userId) {
                throw new Error("Thiếu userId để truy vấn rating cụ thể.");
            }
            ratingFound = await Rating.findOne({
                product:new mongoose.Types.ObjectId(productId),
                user: new mongoose.Types.ObjectId(userId)
            })
            if (ratingFound) {
                return {...ratingFound.toObject(), fromUser:true}
            }
            else{
                return []
                throw new Error("Không tìm được rating của sản phảm") 
            }
        }
        if (Array.isArray(ratingFound) && ratingFound.length > 0){
                // Them truong fromUser de front-end thiet ke rieng cho nhung phan cua nguoi dung do
                const result = ratingFound.map(rating => 
                {
                    return {...rating,
                        fromUser:userId ? userId.toString() === rating.user.toString() : false
                    }
                    
                }
                )
                return result
        }
        
        else{
            throw new Error("Khong tim duoc rating cua san pham") 
        }
    }
    catch(err){
        throw err
    }
}

const deleteRating = async (objectId, objectType = "rating") => {
    try{
        let ratingFound
        
        if (objectType === "product"){
            ratingFound = await Rating.deleteMany({
                product:new  mongoose.Types.ObjectId(objectId)
            })
        }
        else if (objectType === "user"){
            ratingFound = await Rating.find({ user: new mongoose.Types.ObjectId(objectId) });
            await Rating.deleteMany({
                user: new mongoose.Types.ObjectId(objectId)
            })
            
        }
        else {
            ratingFound = await Rating.findByIdAndDelete(new mongoose.Types.ObjectId(objectId))
            ratingFound = [ratingFound]
        }
        if (!ratingFound){
            throw new Error({message:"Khong xoa duoc rating lien quan den doi tuong", object:objectType})
        }
        else{
            if (objectType === "user" || objectType == "rating"){
                for (const rating of ratingFound) {
                    if (!rating) continue; // Nếu không tìm thấy rating, bỏ qua

                    
                    const productFound = await Product.findById( new mongoose.Types.ObjectId(rating.product));

                    // Xu ly hang hoa bi anh huonghuong
                    if (productFound) {
                        const newRatingsCount = productFound.ratingsCount.total - 1; 
                        const newRatingsAvg = newRatingsCount > 0 
                            ? parseFloat((productFound.ratingsAvg * productFound.ratingsCount.total - rating.rate) / newRatingsCount).toFixed(1)
                            : 0; 

                        
                        productFound.ratingsAvg = newRatingsAvg;
                        productFound.ratingsCount.total = newRatingsCount;
                        productFound.ratingsCount[parseInt(rating.rate)] --;
                        
                        await productFound.save();
                    }
                }
            }
        }
        return ratingFound
        
    }
    catch(err){
        throw err
    }
}

const updateRating = async (ratingId, newRating) => {
    try{
        const updateRating =await Rating.findById(new mongoose.Types.ObjectId(ratingId))
        const oldRating = updateRating.rate
        const updateProduct =await Product.findById(new mongoose.Types.ObjectId(updateRating.product))
        const newRatingsAvg = 
        parseFloat((updateProduct.ratingsAvg * updateProduct.ratingsCount.total - oldRating + newRating) 
        / updateProduct.ratingsCount.total).toFixed(1);
        updateProduct.ratingsAvg = newRatingsAvg
        updateProduct.ratingsCount[parseInt(oldRating)] --;
        updateProduct.ratingsCount[parseInt(newRating)] ++;

        await updateProduct.save()
        updateRating.rate = newRating
        await updateRating.save()
        if(!updateRating){
            throw new Error("Khong the update rating")
        }

        return updateRating
    }
    catch(err){
        throw err
    }
}
const getRatingById = async (ratingId) =>{
    try{
        return await Rating.findById(ratingId)
    }
    catch(err){
        throw err
    }
}

module.exports = {
    createRating,
    getRatingProduct,
    deleteRating,
    updateRating,
    getRatingById
}