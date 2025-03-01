import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (
      user &&
      user.password &&
      (await this.userService.validatePassword(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };

    // Remove sensitive information
    const { password: _, ...result } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async register(
    registerDto: RegisterDto
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const newUser = await this.userService.create(registerDto);

    const payload: JwtPayload = { sub: newUser.id, email: newUser.email };

    // Remove sensitive information
    const { password: _, ...result } = newUser;

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async validateWalletAddress(walletAddress: string): Promise<User | null> {
    return this.userService.findByWalletAddress(walletAddress);
  }

  async loginWithWallet(
    walletAddress: string
  ): Promise<{ access_token: string; user: Partial<User> }> {
    let user = await this.userService.findByWalletAddress(walletAddress);

    // If user doesn't exist, create a new one
    if (!user) {
      user = await this.userService.create({
        walletAddress,
        isWalletVerified: true,
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      walletAddress: user.walletAddress,
    };

    // Remove sensitive information
    const { password: _, ...result } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }
}
