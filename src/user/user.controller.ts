import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "User successfully created",
    type: User,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({
    status: 409,
    description: "Email or wallet address already in use",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "Return all users", type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiResponse({ status: 200, description: "Return the user", type: User })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a user" })
  @ApiResponse({
    status: 200,
    description: "User successfully updated",
    type: User,
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a user" })
  @ApiResponse({ status: 200, description: "User successfully deleted" })
  @ApiResponse({ status: 404, description: "User not found" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
