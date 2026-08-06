import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PDFDocument from 'pdfkit';
import { Repository } from 'typeorm';

import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  private async getInvoiceData(orderId: string) {
  const order = await this.orderRepo.findOne({
    where: {
      id: orderId,
    },
    relations: {
      account: true,
      address: true,
    },
  });

  if (!order) {
    throw new NotFoundException(
      'Order not found!',
    );
  }

  const items = await this.orderItemRepo.find({
    where: {
      order: {
        id: orderId,
      },
    },
    relations: {
      product: true,
    },
  });

  return {
    order,
    items,
  };
}


private buildInvoice(
  doc: any,
  order: Order,
  items: OrderItem[],
) {


  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('ShopEasy', {
      align: 'center',
    });

  doc
    .fontSize(16)
    .font('Helvetica')
    .text('INVOICE', {
      align: 'center',
    });

  doc.moveDown();

  // ==========================
  // Order Details
  // ==========================

  doc
    .fontSize(12)
    .font('Helvetica-Bold');

  doc.text(`Order ID : ${order.id}`);

  doc.text(
    `Date : ${order.createdAt.toLocaleDateString()}`,
  );

  doc.moveDown();

  // ==========================
  // Customer
  // ==========================

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Customer');

  doc
    .fontSize(12)
    .font('Helvetica');

  doc.text(`Name : ${order.account.fullName}`);

  doc.text(`Email : ${order.account.email}`);

  doc.moveDown();

  // ==========================
  // Address
  // ==========================

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Shipping Address');

  doc
    .fontSize(12)
    .font('Helvetica');

  doc.text(order.address.fullName);

  doc.text(order.address.addressLine1);

  if (order.address.addressLine2) {
    doc.text(order.address.addressLine2);
  }

  doc.text(
    `${order.address.city}, ${order.address.state}`,
  );

  doc.text(
    `${order.address.country} - ${order.address.postalCode}`,
  );

  doc.moveDown();

  // ==========================
  // Products
  // ==========================

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Products');

  doc.moveDown();

  const startY = doc.y;

  doc.font('Helvetica-Bold');

  doc.text('Product', 50, startY);

  doc.text('Qty', 300, startY);

  doc.text('Price', 400, startY);

  doc.moveDown();

  let grandTotal = 0;

  items.forEach((item) => {
    const y = doc.y;

    grandTotal +=
      Number(item.price) * item.quantity;

    doc.font('Helvetica');

    doc.text(item.product.name, 50, y);

    doc.text(
      item.quantity.toString(),
      300,
      y,
    );

    doc.text(
      `₹${item.price}`,
      400,
      y,
    );

    doc.moveDown();
  });

  doc.moveDown();

  doc
    .font('Helvetica-Bold')
    .fontSize(14);

  doc.text(
    `Grand Total : ₹${grandTotal}`,
  );

  doc.moveDown(2);

  doc
    .font('Helvetica')
    .fontSize(12)
    .text('Thank You For Shopping!', {
      align: 'center',
    });
}



async generateInvoice(
  orderId: string,
  res: any,
) {
  const { order, items } =
    await this.getInvoiceData(orderId);

  const doc = new PDFDocument({
    margin: 50,
  });

  res.setHeader(
    'Content-Type',
    'application/pdf',
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice-${order.id}.pdf`,
  );

  doc.pipe(res);

  this.buildInvoice(
    doc,
    order,
    items,
  );

  doc.end();
}


async generateInvoiceBuffer(
  orderId: string,
): Promise<Buffer> {
  const { order, items } =
    await this.getInvoiceData(orderId);

  const doc = new PDFDocument({
    margin: 50,
  });

  const buffers: Buffer[] = [];

  doc.on('data', (chunk) => {
    buffers.push(chunk);
  });

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    this.buildInvoice(
      doc,
      order,
      items,
    );

    doc.end();
  });
}
}