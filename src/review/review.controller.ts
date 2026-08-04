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


import {
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { multerOptions } from 'src/common/upload/upload.config';

import { CreateReviewWithImageDto } from './dto/create-review-with-image.dto';


@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
  ) {}

  @Post()
@ApiConsumes('multipart/form-data')
@ApiBody({
  type: CreateReviewWithImageDto,
})
@UseInterceptors(
  FileInterceptor(
    'image',
    multerOptions('review'),
  ),
)
create(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateReviewDto,
  @GetUser('id') accountId: string,
) {
  if (file) {
    dto.image =
  `http://localhost:3000/uploads/review/${file.filename}`;
  }

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
