import { Test } from '@nestjs/testing';
import { ProductService } from './product.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('create and retrieve a product', () => {
    const newProduct = service.create({
      name: 'Test Product',
      price: 99.99,
      quantity: 10,
    });

    expect(newProduct.id).toBeDefined();
    expect(newProduct.name).toBe('Test Product');

    const found = service.findOne(newProduct.id);
    expect(found).toEqual(newProduct);
  });

  it('update a product', () => {
    const product = service.create({
      name: 'Test Product',
      price: 99.99,
      quantity: 10,
    });

    const updated = service.update(product.id, { price: 89.99 });
    expect(updated.price).toBe(89.99);
    expect(updated.name).toBe(product.name);
  });

  it('delete a product', () => {
    const product = service.create({
      name: 'Test Product',
      price: 99.99,
      quantity: 10,
    });

    service.remove(product.id);

    expect(() => service.findOne(product.id)).toThrow(NotFoundException);
  });
});
