import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: "Unique identifier for the user" })
  id: string;

  @Column({ unique: true })
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ description: "User full name", example: "John Doe" })
  name: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Ethereum wallet address",
    example: "0x123abc...",
  })
  walletAddress: string;

  @Column({ default: false })
  @ApiProperty({ description: "Email verification status" })
  isEmailVerified: boolean;

  @Column({ default: false })
  @ApiProperty({ description: "Wallet verification status" })
  isWalletVerified: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: "User creation timestamp" })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: "User last update timestamp" })
  updatedAt: Date;

  // Relationships will be added here as needed
  // For example:
  // @OneToMany(() => Property, property => property.owner)
  // properties: Property[];
}
