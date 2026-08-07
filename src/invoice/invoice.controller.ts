import { Controller, Get, Param, Res } from '@nestjs/common';

import type { Response } from 'express';

import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get(':id')
  generateInvoice(@Param('id') id: string, @Res() res: Response) {
    return this.invoiceService.generateInvoice(id, res);
  }
}
