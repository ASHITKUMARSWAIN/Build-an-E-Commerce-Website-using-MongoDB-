import connectDB from "../../lib/db";
import Product from "../../models/product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();
    if (products.length === 0) {
      const seedProducts = [
  { title: "Blue sneakers", description: "Blue sneakers for men", price: 100, category: "sneakers", image: "https://picsum.photos/500/300" },
  { title: "Red sneakers", description: "Red sneakers for men", price: 150, category: "sneakers", image: "https://picsum.photos/500/300" },
  { title: "Black sneakers", description: "Black sneakers for men", price: 200, category: "sneakers", image: "https://picsum.photos/500/300" },
  { title: "White sneakers", description: "White sneakers for men", price: 180, category: "sneakers", image: "https://picsum.photos/500/300" },
  { title: "Running shoes", description: "Lightweight running shoes", price: 220, category: "sports", image: "https://picsum.photos/500/300" },
  { title: "Training shoes", description: "Gym training shoes", price: 210, category: "sports", image: "https://picsum.photos/500/300" },
  { title: "Formal shoes", description: "Elegant formal shoes", price: 300, category: "formal", image: "https://picsum.photos/500/300" },
  { title: "Leather shoes", description: "Premium leather shoes", price: 350, category: "formal", image: "https://picsum.photos/500/300" },
  { title: "Casual loafers", description: "Comfortable loafers", price: 190, category: "casual", image: "https://picsum.photos/500/300" },
  { title: "Slip-on shoes", description: "Easy slip-on shoes", price: 170, category: "casual", image: "https://picsum.photos/500/300" },

  { title: "Sports watch", description: "Digital sports watch", price: 250, category: "accessories", image: "https://picsum.photos/500/300" },
  { title: "Classic watch", description: "Classic analog watch", price: 400, category: "accessories", image: "https://picsum.photos/500/300" },
  { title: "Backpack", description: "Stylish travel backpack", price: 300, category: "bags", image: "https://picsum.photos/500/300" },
  { title: "Laptop bag", description: "Protective laptop bag", price: 280, category: "bags", image: "https://picsum.photos/500/300" },
  { title: "Duffel bag", description: "Spacious duffel bag", price: 320, category: "bags", image: "https://picsum.photos/500/300" },
  { title: "Sunglasses", description: "UV protection sunglasses", price: 120, category: "accessories", image: "https://picsum.photos/500/300" },
  { title: "Cap", description: "Trendy baseball cap", price: 80, category: "accessories", image: "https://picsum.photos/500/300" },
  { title: "Wallet", description: "Leather wallet", price: 150, category: "accessories", image: "https://picsum.photos/500/300" },
  { title: "Belt", description: "Stylish leather belt", price: 130, category: "accessories", image: "https://picsum.photos/500/300" },
  { title: "Jacket", description: "Winter jacket", price: 500, category: "clothing", image: "https://picsum.photos/500/300" },

  { title: "T-shirt", description: "Cotton t-shirt", price: 120, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Shirt", description: "Formal shirt", price: 200, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Jeans", description: "Denim jeans", price: 300, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Shorts", description: "Casual shorts", price: 150, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Track pants", description: "Comfortable track pants", price: 180, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Hoodie", description: "Warm hoodie", price: 350, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Sweater", description: "Winter sweater", price: 320, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Socks pack", description: "Pack of 5 socks", price: 90, category: "clothing", image: "https://picsum.photos/500/300" },
  { title: "Sandals", description: "Comfortable sandals", price: 140, category: "footwear", image: "https://picsum.photos/500/300" },
  { title: "Flip flops", description: "Casual flip flops", price: 70, category: "footwear", image: "https://picsum.photos/500/300" },

  { title: "Boots", description: "Stylish boots", price: 400, category: "footwear", image: "https://picsum.photos/500/300" },
  { title: "Running shorts", description: "Sports running shorts", price: 160, category: "sports", image: "https://picsum.photos/500/300" },
  { title: "Gym gloves", description: "Workout gloves", price: 110, category: "sports", image: "https://picsum.photos/500/300" },
  { title: "Water bottle", description: "Reusable water bottle", price: 90, category: "sports", image: "https://picsum.photos/500/300" },
  { title: "Yoga mat", description: "Comfortable yoga mat", price: 200, category: "sports", image: "https://picsum.photos/500/300" },
  { title: "Headphones", description: "Wireless headphones", price: 600, category: "electronics", image: "https://picsum.photos/500/300" },
  { title: "Bluetooth speaker", description: "Portable speaker", price: 450, category: "electronics", image: "https://picsum.photos/500/300" },
  { title: "Smartwatch", description: "Fitness smartwatch", price: 800, category: "electronics", image: "https://picsum.photos/500/300" },
  { title: "Mobile stand", description: "Adjustable mobile stand", price: 70, category: "electronics", image: "https://picsum.photos/500/300" },
  { title: "Power bank", description: "10000mAh power bank", price: 350, category: "electronics", image: "https://picsum.photos/500/300" }
  ];
  await Product.insertMany(seedProducts);
    }

    const finalProducts = await Product.find();
    return Response.json(finalProducts, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}