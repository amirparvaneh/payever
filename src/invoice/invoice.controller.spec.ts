import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Invoice } from './invoice.schema';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;
  const mockInvoiceModel = {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(Invoice.name))
      .useValue(mockInvoiceModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /invoices', () => {
    it('should create a new invoice', async () => {
      const createInvoiceDto = {
        customer: 'John Doe',
        amount: 500,
        reference: 'INV-12345',
        items: [{ sku: 'ITEM-001', qt: 2 }],
      };

      const createdInvoice = {
        ...createInvoiceDto,
        _id: 'mockId',
        date: new Date(),
      };

      mockInvoiceModel.create.mockResolvedValue(createdInvoice);

      const response = await request(app.getHttpServer())
        .post('/invoices')
        .send(createInvoiceDto)
        .expect(201);

      expect(response.body).toEqual(createdInvoice);
      expect(mockInvoiceModel.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });

  describe('GET /invoices/:id', () => {
    it('should return an invoice by ID', async () => {
      const invoiceId = 'mockId';
      const foundInvoice = {
        _id: invoiceId,
        customer: 'John Doe',
        amount: 500,
        reference: 'INV-12345',
        items: [{ sku: 'ITEM-001', qt: 2 }],
        date: new Date(),
      };

      mockInvoiceModel.findById.mockResolvedValue(foundInvoice);

      const response = await request(app.getHttpServer())
        .get(`/invoices/${invoiceId}`)
        .expect(200);

      expect(response.body).toEqual(foundInvoice);
      expect(mockInvoiceModel.findById).toHaveBeenCalledWith(invoiceId);
    });

    it('should return 404 if invoice is not found', async () => {
      const invoiceId = 'nonExistentId';
      mockInvoiceModel.findById.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get(`/invoices/${invoiceId}`)
        .expect(404);
    });
  });

  describe('GET /invoices', () => {
    it('should return a list of invoices', async () => {
      const invoices = [
        {
          _id: 'mockId1',
          customer: 'John Doe',
          amount: 500,
          reference: 'INV-12345',
          items: [{ sku: 'ITEM-001', qt: 2 }],
          date: new Date(),
        },
        {
          _id: 'mockId2',
          customer: 'Jane Doe',
          amount: 300,
          reference: 'INV-54321',
          items: [{ sku: 'ITEM-002', qt: 5 }],
          date: new Date(),
        },
      ];

      mockInvoiceModel.find.mockResolvedValue(invoices);

      const response = await request(app.getHttpServer())
        .get('/invoices')
        .expect(200);

      expect(response.body).toEqual(invoices);
      expect(mockInvoiceModel.find).toHaveBeenCalledWith({});
    });

    it('should return filtered invoices by date range', async () => {
      const startDate = '2025-01-01';
      const endDate = '2025-01-10';
      const filter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };

      const invoices = [
        {
          _id: 'mockId1',
          customer: 'John Doe',
          amount: 500,
          reference: 'INV-12345',
          items: [{ sku: 'ITEM-001', qt: 2 }],
          date: new Date('2025-01-05'),
        },
      ];

      mockInvoiceModel.find.mockResolvedValue(invoices);

      const response = await request(app.getHttpServer())
        .get('/invoices')
        .query({ startDate, endDate })
        .expect(200);

      expect(response.body).toEqual(invoices);
      expect(mockInvoiceModel.find).toHaveBeenCalledWith(filter);
    });
  });
});
