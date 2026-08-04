import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryWithImageDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;
}