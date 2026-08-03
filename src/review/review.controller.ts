import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ReviewService } from './review.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
} from './dto/review.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateReviewDto,
    @GetUser('id') accountId: string,
  ) {
    return this.reviewService.create(dto, accountId);
  }

  @Get('product/:id')
  findByProduct(
    @Param('id') id: string,
  ) {
    return this.reviewService.findByProduct(id);
  }

  @Get('my-review')
  myReviews(
    @GetUser('id') accountId: string,
  ) {
    return this.reviewService.myReviews(accountId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.reviewService.remove(id);
  }
}
