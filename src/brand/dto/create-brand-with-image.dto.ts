import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandWithImageDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;
}
