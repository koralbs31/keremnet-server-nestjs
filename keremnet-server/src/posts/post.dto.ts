/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateOrUpdatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  author: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
}
