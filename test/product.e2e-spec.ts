import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ProductResponse } from './types';
import { HttpStatus } from '@nestjs/common';
import { App } from 'supertest/types';

describe('Product API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('complete product lifecycle', async () => {
    // We want to create a product, get it, update one field in it,
    // delete it and verify it is deleted

    const appServer = app.getHttpServer() as App;
    const testProduct = {
      name: 'Test Product',
      price: 99.99,
      quantity: 10,
    };

    // Create a product
    const createResponse = await request(appServer)
      .post('/products')
      .send(testProduct)
      .expect(HttpStatus.CREATED);

    const createdProduct = createResponse.body as ProductResponse;
    expect(createdProduct.id).toBeDefined();
    expect(typeof createdProduct.id).toBe('number');

    // Get the created product
    const getResponse = await request(appServer)
      .get(`/products/${createdProduct.id}`)
      .expect(HttpStatus.OK);

    const retrievedProduct = getResponse.body as ProductResponse;
    expect(retrievedProduct.name).toBe(testProduct.name);

    // Update the product
    const newPrice = 89.99;
    const updateResponse = await request(appServer)
      .patch(`/products/${createdProduct.id}`)
      .send({ price: newPrice })
      .expect(HttpStatus.OK);

    const updatedProduct = updateResponse.body as ProductResponse;
    expect(updatedProduct.price).toBe(newPrice);

    // Delete the product
    await request(appServer)
      .delete(`/products/${createdProduct.id}`)
      .expect(HttpStatus.OK);

    // Verify product is deleted
    await request(appServer)
      .get(`/products/${createdProduct.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
