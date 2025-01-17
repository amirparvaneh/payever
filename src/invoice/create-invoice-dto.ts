import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';

class ItemDto {
  @IsString()
  sku: string;

  @IsNumber()
  qt: number;
}

export class CreateInvoiceDto {
  @IsString()
  customer: string;

  @IsNumber()
  amount: number;

  @IsString()
  reference: string;

  @ValidateNested({ each: true })
  @IsArray()
  items: ItemDto[];
}
