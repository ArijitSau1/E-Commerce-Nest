import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendWelcomeEmail(name: string, email: string) {
    return this.mailerService.sendMail({
      from: `ShopEasy <${process.env.MAIL_FROM}>`, 
      to: email,
      subject: 'Welcome to ShopEasy 🎉',
      html: `
        <h2>Hello ${name},</h2>

        <p>Your account has been created successfully.</p>

        <p>Thank you for registering with <b>ShopEasy</b>.</p>

        <br>

        <p>Happy Shopping 😊</p>

        <hr>

        <small>ShopEasy Team</small>
      `,
    });
  }

  async sendOrderConfirmationEmail(
  name: string,
  email: string,
  orderId: string,
  amount: number,
  products: string,
) {
  return this.mailerService.sendMail({
    from: `ShopEasy <${process.env.MAIL_FROM}>`,
    to: email,
    subject: '🛒 Order Confirmation - ShopEasy',

    html: `
      <h2>Hello ${name},</h2>

      <p>Your order has been placed successfully.</p>

      <h3>Products Ordered</h3>

      ${products}


      <hr>

      <p><b>Order ID:</b> ${orderId}</p>

      <p><b>Total Amount:</b> ₹${amount}</p>

      <p><b>Status:</b> PENDING</p>

      <hr>

      <p>Thank you for shopping with <b>ShopEasy</b>.</p>

      <p>We will notify you once your order is confirmed and shipped.</p>

      <br>

      <p>Happy Shopping 😊</p>

      <small>ShopEasy Team</small>
    `,
  });
}

async sendOrderStatusEmail(
  name: string,
  email: string,
  orderId: string,
  status: string,
) {
  return this.mailerService.sendMail({
    from: `ShopEasy <${process.env.MAIL_FROM}>`,
    to: email,
    subject: `Order ${status} - ShopEasy`,

    html: `
      <h2>Hello ${name},</h2>

      <p>Your order status has been updated.</p>

      <hr>

      <p><b>Order ID:</b> ${orderId}</p>

      <p><b>Current Status:</b> ${status}</p>

      <hr>

      <p>Thank you for shopping with <b>ShopEasy</b>.</p>

      <p>We appreciate your business.</p>

      <br>

      <p>ShopEasy Team</p>
    `,
  });
}
}
