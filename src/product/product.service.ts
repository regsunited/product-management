import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.interface';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  private products: Product[] = [];
  private idCounter = 1;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const product: Product = {
      id: this.idCounter++,
      ...createProductDto,
    };
    this.products.push(product);
    return product;
  }

  update(id: number, updateData: Partial<CreateProductDto>): Product {
    const product = this.findOne(id);
    Object.assign(product, updateData);
    return product;
  }

  remove(id: number): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
  }
}
