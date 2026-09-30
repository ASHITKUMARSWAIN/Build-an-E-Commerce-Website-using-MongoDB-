import OpenAI from "openai";
import connectDB from "../../lib/db";
import Product from "../../models/product";

export async function POST(request) {
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return Response.json({ error: "Enter what you are looking for." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      return Response.json({ error: "AI search is not configured on the server." }, { status: 503 });
    }

    await connectDB();
    const catalog = await Product.find()
      .select("title description price category image")
      .lean();

    if (catalog.length === 0) {
      return Response.json({ products: [], message: "There are no products to recommend yet." });
    }

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are a helpful shopping stylist. Match the shopper\'s intent, occasion, and requested product type to the provided catalog. Choose at most 8 products using only their exact IDs. Return JSON with "productIds" (IDs ordered by relevance) and "message" (one concise explanation). If nothing fits, return an empty productIds array. Never invent products or IDs.',
        },
        {
          role: "user",
          content: JSON.stringify({
            query,
            catalog: catalog.map((product) => ({
              id: String(product._id),
              title: product.title,
              description: product.description,
              category: product.category,
              price: product.price,
            })),
          }),
        },
      ],
    });

    const recommendation = JSON.parse(completion.choices[0].message.content || "{}");
    const productsById = new Map(catalog.map((product) => [String(product._id), product]));
    const products = Array.isArray(recommendation.productIds)
      ? recommendation.productIds
          .filter((id) => typeof id === "string")
          .slice(0, 8)
          .map((id) => productsById.get(id))
          .filter(Boolean)
      : [];

    return Response.json({
      products,
      message:
        typeof recommendation.message === "string" ? recommendation.message : "Here are some relevant products.",
    });
  } catch (error) {
    console.error("AI product search failed:", error);
    const providerStatus = typeof error?.status === "number" ? error.status : 500;
    const message =
      providerStatus === 429
        ? "The AI search service is out of quota or rate-limited. Check your OpenAI API billing and limits, then try again."
        : providerStatus === 401 || providerStatus === 403
          ? "The AI search API key was rejected. Check the OpenAI key in your .env file."
          : "AI search is temporarily unavailable. Please try again.";

    return Response.json({ error: message }, { status: providerStatus === 500 ? 500 : 503 });
  }
}