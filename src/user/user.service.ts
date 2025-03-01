import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { walletAddress } });
  }

  async create(userData: Partial<User>): Promise<User> {
    // Check if email already exists
    if (userData.email) {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException("Email already in use");
      }
    }

    // Check if wallet address already exists
    if (userData.walletAddress) {
      const existingUser = await this.findByWalletAddress(
        userData.walletAddress
      );
      if (existingUser) {
        throw new ConflictException("Wallet address already in use");
      }
    }

    // Hash password if provided
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }

    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    // Check if user exists
    await this.findOne(id);

    // Hash password if provided
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }

    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
