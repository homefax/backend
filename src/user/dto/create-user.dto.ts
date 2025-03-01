import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsBoolean,
} from "class-validator";

export class CreateUserDto {
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
    required: false,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: "Ethereum wallet address",
    example: "0x123abc...",
    required: false,
  })
  @IsString()
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({
    description: "Email verification status",
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @ApiProperty({
    description: "Wallet verification status",
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isWalletVerified?: boolean;
}
