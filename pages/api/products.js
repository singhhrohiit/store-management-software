// pages/api/products.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
      return res.status(200).json(products);
    }

    if (req.method === "POST") {
      const { name, sku, price, cost, stock } = req.body;
      if (!name || !sku || price == null)
        return res.status(400).json({ error: "name, sku, price required" });

      const product = await prisma.product.create({
        data: {
          name,
          sku,
          price: Number(price),
          cost: cost ? Number(cost) : undefined,
          stock: Number(stock || 0),
        },
      });

      return res.status(201).json(product);
    }

    return res.status(405).end(); // Method not allowed
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal" });
  }
}
