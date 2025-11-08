// pages/api/products/[id].js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function handler(req, res) {
  const { id } = req.query;
  const pid = Number(id);
  if (!pid) return res.status(400).json({ error: "invalid id" });

  try {
    if (req.method === "GET") {
      const product = await prisma.product.findUnique({ where: { id: pid } });
      if (!product) return res.status(404).json({ error: "not found" });
      return res.status(200).json(product);
    }

    if (req.method === "PUT") {
      const { name, sku, price, cost, stock } = req.body;
      if (!name || !sku || price == null)
        return res.status(400).json({ error: "name, sku, price required" });

      const updated = await prisma.product.update({
        where: { id: pid },
        data: {
          name,
          sku,
          price: Number(price),
          cost: cost != null ? Number(cost) : null,
          stock: Number(stock || 0),
        },
      });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.product.delete({ where: { id: pid } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "internal" });
  }
}
