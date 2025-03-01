import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { EthStorageService } from "./ethstorage.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("ethstorage")
@Controller("ethstorage")
export class EthStorageController {
  constructor(private readonly ethStorageService: EthStorageService) {}

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload a file to EthStorage" })
  @ApiResponse({ status: 201, description: "File uploaded successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadFile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { fileName?: string }
  ) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      if (!file) {
        throw new BadRequestException("File is required");
      }

      const fileName = body.fileName || file.originalname;
      const fileId = await this.ethStorageService.uploadFile(
        fileName,
        file.buffer
      );

      return {
        success: true,
        fileId,
        fileName,
        message: "File uploaded successfully to EthStorage",
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload file to EthStorage: ${error.message}`
      );
    }
  }

  @Get("download/:fileId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Download a file from EthStorage" })
  @ApiResponse({ status: 200, description: "File downloaded successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async downloadFile(@Request() req, @Param("fileId") fileId: string) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const fileContent = await this.ethStorageService.downloadFile(fileId);

      return {
        success: true,
        fileId,
        content: fileContent.toString("base64"),
        message: "File downloaded successfully from EthStorage",
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to download file from EthStorage: ${error.message}`
      );
    }
  }

  @Get("files")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List all files in EthStorage" })
  @ApiResponse({ status: 200, description: "Files listed successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async listFiles(@Request() req) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const files = await this.ethStorageService.listFiles();

      return {
        success: true,
        files,
        message: "Files listed successfully from EthStorage",
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to list files from EthStorage: ${error.message}`
      );
    }
  }

  @Get("contract-address")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the EthStorage contract address" })
  @ApiResponse({
    status: 200,
    description: "Contract address retrieved successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async getContractAddress(@Request() req) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const contractAddress = this.ethStorageService.getContractAddress();

      return {
        success: true,
        contractAddress,
        message: "Contract address retrieved successfully",
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get contract address: ${error.message}`
      );
    }
  }
}
