const Rating = require("../models/rating")
const Product = require("../models/product")
const mongoose = require("mongoose")

const createRating = async (userId, productID, rating) => {
    try{
        const newRating = await Rating.create({
            user: mongoose.Types.ObjectId(userId),
            product: mongoose.Types.ObjectId(productID),
            rate: rating})
        if(newRating){
            // Xu ly san pham khi co them rating moi
            const product = await Product.findById(mongoose.Types.ObjectId(productID))
            if(product){
                //Them so rating va tinh la tb rating
                const newCount = product.ratingsCount + 1
                product.ratingsAvg = Math.round((product.ratingsAvg * product.ratingsCount + rating.rate)/ newCount)
                product.ratingsCount  = newCount
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
    catch(err){
        throw err
    }
}

const getRating = async (productId, userId= null) => {
    try{
        const ratingFound = await Rating.find({
            product: mongoose.Types.ObjectId(productId)
        }).lean()
        if (ratingFound.length > 0){
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
                product: mongoose.Types.ObjectId(objectId)
            })
        }
        else if (objectType === "user"){
            ratingFound = await Rating.deleteMany({
                user:mongoose.Types.ObjectId(objectId)
            })
            
        }
        else {
            ratingFound = await Rating.findByIdAndDelete(mongoose.Types.ObjectId(objectId))
            ratingFound = [ratingFound]
        }
        if (!ratingFound){
            throw new Error({message:"Khong xoa duoc rating lien quan den doi tuong", object:objectType})
        }
        else{
            if (objectType === "user" || objectType == "rating"){
                for (const rating of ratingFound) {
                    if (!rating) continue; // Nếu không tìm thấy rating, bỏ qua

                    
                    const productFound = await Product.findById(mongoose.Types.ObjectId(rating.product));

                    
                    if (productFound) {
                        const newRatingsCount = productFound.ratingsCount - 1; 
                        const newRatingsAvg = newRatingsCount > 0 
                            ? (productFound.ratingsAvg * productFound.ratingsCount - rating.rate) / newRatingsCount
                            : 0; 

                        
                        productFound.ratingsAvg = newRatingsAvg;
                        productFound.ratingsCount = newRatingsCount;

                        
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
        const updateRating =await Rating.findById(mongoose.Types.ObjectId(ratingId))
        const oldRating = updateRating.rate
        const updateProduct =await Product.findById(mongoose.Types.ObjectId(updateRating.product))
        const newRatingsAvg = (updateProduct.ratingsAvg * updateProduct.ratingsCount - oldRating + newRating) / updateProduct.ratingsCount
        updateProduct.ratingsAvg = newRatingsAvg
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

module.exports = {
    createRating,
    getRating,
    deleteRating,
    updateRating
}