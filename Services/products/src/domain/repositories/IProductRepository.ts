// Update the import path below if your pg module is located elsewhere
import { pg } from "../../infrastructure/db/pg";
import { v4 as uuid } from "uuid";
import { CreateProductDTO, Product, UpdateProductDTO } from "../../domain/entities/Product";

export class ProductRepository {
  async create(data: CreateProductDTO): Promise<Product> {
    const id = uuid();
    const { name, description = null, price, createdBy } = data;

    const result = await pg.query(
      `INSERT INTO products (id, name, description, price, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, price::float as price, created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"`,
      [id, name, description, price, createdBy]
    );
    return result.rows[0];
  }

  async findAll(): Promise<Product[]> {
    const result = await pg.query(
      `SELECT id, name, description, price::float as price, created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"
       FROM products
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async findById(id: string): Promise<Product | null> {
    const result = await pg.query(
      `SELECT id, name, description, price::float as price, created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"
       FROM products WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined)       { fields.push(`name = $${idx++}`);       values.push(data.name); }
    if (data.description !== undefined){ fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.price !== undefined)      { fields.push(`price = $${idx++}`);      values.push(data.price); }

    if (fields.length === 0) return this.findById(id);

    // updated_at
    fields.push(`updated_at = NOW()`);

    values.push(id);
    const q = `
      UPDATE products SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING id, name, description, price::float as price, created_by as "createdBy", created_at as "createdAt", updated_at as "updatedAt"
    `;
    const result = await pg.query(q, values);
    return result.rows[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await pg.query(`DELETE FROM products WHERE id = $1`, [id]);
    return result.rowCount > 0;
  }
}
