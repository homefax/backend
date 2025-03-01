import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BlockchainService } from "./blockchain.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("blockchain")
@Controller("blockchain")
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post("property")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new property on the blockchain" })
  @ApiResponse({ status: 201, description: "Property created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async createProperty(
    @Request() req,
    @Body()
    propertyData: {
      propertyAddress: string;
      city: string;
      state: string;
      zipCode: string;
    }
  ) {
    try {
      const { propertyAddress, city, state, zipCode } = propertyData;
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const propertyId = await this.blockchainService.createProperty(
        userAddress,
        propertyAddress,
        city,
        state,
        zipCode
      );

      return {
        success: true,
        propertyId,
        message: "Property created successfully",
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create property: ${error.message}`
      );
    }
  }

  @Post("report")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new report on the blockchain" })
  @ApiResponse({ status: 201, description: "Report created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async createReport(
    @Request() req,
    @Body()
    reportData: {
      propertyId: number;
      reportType: string;
      reportHash: string;
      authorAddress: string;
      ownerAddress: string;
      price: string;
    }
  ) {
    try {
      const {
        propertyId,
        reportType,
        reportHash,
        authorAddress,
        ownerAddress,
        price,
      } = reportData;
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      if (!authorAddress) {
        throw new BadRequestException("Author address is required");
      }

      if (!ownerAddress) {
        throw new BadRequestException("Owner address is required");
      }

      const reportId = await this.blockchainService.createReport(
        authorAddress,
        ownerAddress,
        propertyId,
        reportType,
        reportHash,
        price
      );

      return {
        success: true,
        reportId,
        message: "Report created successfully",
        author: authorAddress,
        owner: ownerAddress,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create report: ${error.message}`
      );
    }
  }

  @Post("report/:id/purchase")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Purchase a report on the blockchain" })
  @ApiResponse({ status: 200, description: "Report purchased successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async purchaseReport(
    @Request() req,
    @Param("id") reportId: number,
    @Body() purchaseData: { price: string }
  ) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const success = await this.blockchainService.purchaseReport(
        userAddress,
        reportId,
        purchaseData.price
      );

      return {
        success,
        message: "Report purchased successfully",
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to purchase report: ${error.message}`
      );
    }
  }

  @Get("property/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a property from the blockchain" })
  @ApiResponse({ status: 200, description: "Property retrieved successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async getProperty(@Request() req, @Param("id") propertyId: number) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const property = await this.blockchainService.getProperty(
        userAddress,
        propertyId
      );

      return {
        success: true,
        property,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get property: ${error.message}`);
    }
  }

  @Get("report/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a report from the blockchain" })
  @ApiResponse({ status: 200, description: "Report retrieved successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async getReport(@Request() req, @Param("id") reportId: number) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const report = await this.blockchainService.getReport(
        userAddress,
        reportId
      );

      return {
        success: true,
        report,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get report: ${error.message}`);
    }
  }

  @Get("report/:id/content")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get report content from the blockchain" })
  @ApiResponse({
    status: 200,
    description: "Report content retrieved successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async getReportContent(@Request() req, @Param("id") reportId: number) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const reportHash = await this.blockchainService.getReportContent(
        userAddress,
        reportId
      );

      // In a real application, you would fetch the content from IPFS using this hash
      return {
        success: true,
        reportHash,
        // This would be replaced with actual content from IPFS
        content: `This is a placeholder for report content with hash: ${reportHash}`,
        contentType: "text/plain",
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get report content: ${error.message}`
      );
    }
  }

  @Get("user/properties")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all properties owned by the user" })
  @ApiResponse({
    status: 200,
    description: "Properties retrieved successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async getUserProperties(@Request() req) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const propertyIds =
        await this.blockchainService.getUserProperties(userAddress);

      return {
        success: true,
        propertyIds,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get user properties: ${error.message}`
      );
    }
  }

  @Get("property/:id/reports")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all reports for a property" })
  @ApiResponse({ status: 200, description: "Reports retrieved successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async getPropertyReports(@Request() req, @Param("id") propertyId: number) {
    try {
      const userAddress = req.user.walletAddress;

      if (!userAddress) {
        throw new BadRequestException("User wallet address is required");
      }

      const reportIds = await this.blockchainService.getPropertyReports(
        userAddress,
        propertyId
      );

      return {
        success: true,
        reportIds,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get property reports: ${error.message}`
      );
    }
  }
}
