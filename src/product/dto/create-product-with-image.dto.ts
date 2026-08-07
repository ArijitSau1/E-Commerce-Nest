import { ApiProperty } from '@nestjs/swagger';

export class CreateProductWithImageDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  brandId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;
}
