import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "User password",
    example: "Password123!",
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password: string;

  @ApiProperty({
    description: "Ethereum wallet address",
    example: "0x123abc...",
    required: false,
  })
  @IsString()
  @IsOptional()
  walletAddress?: string;
}
