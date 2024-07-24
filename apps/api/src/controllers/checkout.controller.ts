import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CheckoutController {
  public async createCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventId, tickets } = req.body;

      const createdOrders = await Promise.all(tickets.map(async (ticket: any) => {
        const createdOrder = await prisma.order.create({
          data: {
            eventId,
            ticketId: ticket.id,
            quantity: ticket.count,
            totalPrice: ticket.price * ticket.count,
          },
        });
        return createdOrder;
      }));

      res.status(201).json(createdOrders);
    } catch (error: any) {
      console.error('Error during checkout:', error);
      res.status(500).json({ message: 'Failed to proceed to checkout', error: error.message });
    }
  }
}
