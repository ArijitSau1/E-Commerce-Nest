import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewWithImageDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({
    required: false,
  })
  review?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;
}