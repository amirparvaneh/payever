import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invoice } from './invoice.schema';
import { mockInvoiceModel } from './invoice.model.mock';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create and return a new invoice', async () => {
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

      const result = await service.createInvoice(createInvoiceDto);
      expect(mockInvoiceModel.create).toHaveBeenCalledWith(createInvoiceDto);
      expect(result).toEqual(createdInvoice);
    });
  });

  describe('getInvoiceById', () => {
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

      const result = await service.getInvoiceById(invoiceId);
      expect(mockInvoiceModel.findById).toHaveBeenCalledWith(invoiceId);
      expect(result).toEqual(foundInvoice);
    });
  });

  describe('getAllInvoices', () => {
    it('should return all invoices without filters', async () => {
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

      const result = await service.getAllInvoices();
      expect(mockInvoiceModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(invoices);
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

      const result = await service.getAllInvoices(startDate, endDate);
      expect(mockInvoiceModel.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual(invoices);
    });
  });
});
