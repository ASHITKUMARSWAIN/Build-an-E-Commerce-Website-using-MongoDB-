import mongoose from "mongoose";
const productSchema = nre mongoose.Schema({
    title: String,
    descripition: Number,
    price: Number,
    category: String,
    image: String,
});
export default mongoose.models.product || mongoose.model("product", productSchema);