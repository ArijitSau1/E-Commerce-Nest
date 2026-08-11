import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

import {
  OrderStatus,
  ReturnStatus,
} from 'src/enum';

import {
  CreateReturnDto,
  UpdateReturnStatusDto,
} from './dto/return.dto';

import { Return } from './entities/return.entity';

@Injectable()
export class ReturnService {
  constructor(
    @InjectRepository(Return)
    private readonly returnRepo: Repository<Return>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}



  async create(
    dto: CreateReturnDto,
    accountId: string,
  ) {
    
    const order = await this.orderRepo.findOne({
      where: {
        id: dto.orderId,
      },
      relations: {
        account: true,
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Order not found!',
      );
    }


    if (order.account.id !== accountId) {
      throw new BadRequestException(
        'You cannot return an order that does not belong to you.',
      );
    }


    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'Only delivered orders can be returned.',
      );
    }

    
    const orderItem =
      await this.orderItemRepo.findOne({
        where: {
          id: dto.orderItemId,
        },
        relations: {
          order: true,
          product: true,
        },
      });

    if (!orderItem) {
      throw new NotFoundException(
        'Order item not found!',
      );
    }

    
    if (orderItem.order.id !== dto.orderId) {
      throw new BadRequestException(
        'This item does not belong to the selected order.',
      );
    }

   
    const existingReturn =
      await this.returnRepo.findOne({
        where: {
          accountId,
          orderItemId: dto.orderItemId,
        },
      });

    if (existingReturn) {
      throw new ConflictException(
        'Return request already exists for this product.',
      );
    }

    
    const refundAmount =
      Number(orderItem.price) *
      orderItem.quantity;

    
    const returnRequest =
      this.returnRepo.create({
        accountId,
        orderId: dto.orderId,
        orderItemId: dto.orderItemId,
        type: dto.type,
        reason: dto.reason,
        description: dto.description,
        status: ReturnStatus.REQUESTED,
        refundAmount,
      });

   
    return this.returnRepo.save(
      returnRequest,
    );
  }

 



  async findMyReturns(accountId: string) {
    return this.returnRepo.find({
      where: {
        accountId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }




  async findAll() {
    return this.returnRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }





  async findOne(id: string) {
    const returnRequest =
      await this.returnRepo.findOne({
        where: {
          id,
        },
      });

    if (!returnRequest) {
      throw new NotFoundException(
        'Return request not found!',
      );
    }

    return returnRequest;
  }




  async updateStatus(
    id: string,
    dto: UpdateReturnStatusDto,
  ) {
    const returnRequest =
      await this.findOne(id);





    if (
      returnRequest.status ===
      ReturnStatus.REFUNDED
    ) {
      throw new BadRequestException(
        'Refund has already been completed.',
      );
    }



    if (
      dto.status === ReturnStatus.REJECTED
    ) {
      if (
        returnRequest.status !==
        ReturnStatus.REQUESTED
      ) {
        throw new BadRequestException(
          'Only requested returns can be rejected.',
        );
      }

      returnRequest.status =
        ReturnStatus.REJECTED;

      if (dto.adminRemark !== undefined) {
        returnRequest.adminRemark =
          dto.adminRemark;
      }

      return this.returnRepo.save(
        returnRequest,
      );
    }



    if (
      dto.status === ReturnStatus.APPROVED
    ) {
      if (
        returnRequest.status !==
        ReturnStatus.REQUESTED
      ) {
        throw new BadRequestException(
          'Only requested returns can be approved.',
        );
      }

      returnRequest.status =
        ReturnStatus.APPROVED;

      if (dto.adminRemark !== undefined) {
        returnRequest.adminRemark =
          dto.adminRemark;
      }

      return this.returnRepo.save(
        returnRequest,
      );
    }



    if (
      dto.status === ReturnStatus.PICKED_UP
    ) {
      if (
        returnRequest.status !==
        ReturnStatus.APPROVED
      ) {
        throw new BadRequestException(
          'Return must be approved before pickup.',
        );
      }

      returnRequest.status =
        ReturnStatus.PICKED_UP;

      if (dto.adminRemark !== undefined) {
        returnRequest.adminRemark =
          dto.adminRemark;
      }

      return this.returnRepo.save(
        returnRequest,
      );
    }




    if (
      dto.status === ReturnStatus.RECEIVED
    ) {
      if (
        returnRequest.status !==
        ReturnStatus.PICKED_UP
      ) {
        throw new BadRequestException(
          'Product must be picked up before it can be received.',
        );
      }

      returnRequest.status =
        ReturnStatus.RECEIVED;

      if (dto.adminRemark !== undefined) {
        returnRequest.adminRemark =
          dto.adminRemark;
      }

      return this.returnRepo.save(
        returnRequest,
      );
    }




    if (
      dto.status === ReturnStatus.REFUNDED
    ) {
      if (
        returnRequest.status !==
        ReturnStatus.RECEIVED
      ) {
        throw new BadRequestException(
          'Product must be received before refund.',
        );
      }


      if (
        dto.refundAmount !== undefined &&
        dto.refundAmount >
          Number(returnRequest.refundAmount)
      ) {
        throw new BadRequestException(
          'Refund amount cannot be greater than the original refund amount.',
        );
      }

      if (dto.refundAmount !== undefined) {
        returnRequest.refundAmount =
          dto.refundAmount;
      }

      returnRequest.status =
        ReturnStatus.REFUNDED;

      if (dto.adminRemark !== undefined) {
        returnRequest.adminRemark =
          dto.adminRemark;
      }

      return this.returnRepo.save(
        returnRequest,
      );
    }



    throw new BadRequestException(
      'Invalid return status.',
    );
  }
}
