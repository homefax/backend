import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as HomeFaxArtifact from '../../../contracts/artifacts/contracts/HomeFax.sol/HomeFax.json';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private homeFaxContract: ethers.Contract;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      // Initialize provider
      const rpcUrl = this.configService.get<string>('ETHEREUM_RPC_URL');
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Initialize wallet
      const privateKey = this.configService.get<string>('ETHEREUM_PRIVATE_KEY');
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      
      // Initialize contract
      const contractAddress = this.configService.get<string>('HOMEFAX_CONTRACT_ADDRESS');
      this.homeFaxContract = new ethers.Contract(
        contractAddress,
        HomeFaxArtifact.abi,
        this.wallet
      );

      this.logger.log('Blockchain service initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize blockchain service: ${error.message}`);
      throw error;
    }
  }

  /**
   * Authorizes a user to interact with the HomeFax contract
   * @param userAddress The Ethereum address of the user to authorize
   */
  async authorizeUser(userAddress: string): Promise<boolean> {
    try {
      // Check if user is already authorized
      const isAuthorized = await this.homeFaxContract.isAuthorizedUser(userAddress);
      if (isAuthorized) {
        return true;
      }

      // Authorize user
      const tx = await this.homeFaxContract.authorizeUser(userAddress);
      await tx.wait();
      
      this.logger.log(`User ${userAddress} authorized successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to authorize user ${userAddress}: ${error.message}`);
      return false;
    }
  }

  /**
   * Deauthorizes a user from interacting with the HomeFax contract
   * @param userAddress The Ethereum address of the user to deauthorize
   */
  async deauthorizeUser(userAddress: string): Promise<boolean> {
    try {
      const tx = await this.homeFaxContract.deauthorizeUser(userAddress);
      await tx.wait();
      
      this.logger.log(`User ${userAddress} deauthorized successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to deauthorize user ${userAddress}: ${error.message}`);
      return false;
    }
  }

  /**
   * Creates a property on the HomeFax contract
   * @param userAddress The Ethereum address of the property owner
   * @param propertyAddress The physical address of the property
   * @param city The city where the property is located
   * @param state The state where the property is located
   * @param zipCode The zip code of the property
   */
  async createProperty(
    userAddress: string,
    propertyAddress: string,
    city: string,
    state: string,
    zipCode: string
  ): Promise<number> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Create property using contract owner's wallet (backend)
      const tx = await this.homeFaxContract.createProperty(
        propertyAddress,
        city,
        state,
        zipCode
      );
      const receipt = await tx.wait();

      // Extract property ID from event
      const event = receipt.logs[0];
      const propertyId = event.args[0];
      
      this.logger.log(`Property created with ID ${propertyId}`);
      return Number(propertyId);
    } catch (error) {
      this.logger.error(`Failed to create property: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a report on the HomeFax contract
   * @param userAddress The Ethereum address of the report creator
   * @param propertyId The ID of the property the report is for
   * @param reportType The type of report
   * @param reportHash The IPFS hash of the report content
   * @param price The price to purchase access to this report
   */
  async createReport(
    userAddress: string,
    propertyId: number,
    reportType: string,
    reportHash: string,
    price: string
  ): Promise<number> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Convert price to wei
      const priceInWei = ethers.parseEther(price);

      // Create report using contract owner's wallet (backend)
      const tx = await this.homeFaxContract.createReport(
        propertyId,
        reportType,
        reportHash,
        priceInWei
      );
      const receipt = await tx.wait();

      // Extract report ID from event
      const event = receipt.logs[0];
      const reportId = event.args[0];
      
      this.logger.log(`Report created with ID ${reportId}`);
      return Number(reportId);
    } catch (error) {
      this.logger.error(`Failed to create report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Purchases a report on the HomeFax contract
   * @param userAddress The Ethereum address of the buyer
   * @param reportId The ID of the report to purchase
   * @param price The price to pay for the report
   */
  async purchaseReport(
    userAddress: string,
    reportId: number,
    price: string
  ): Promise<boolean> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Convert price to wei
      const priceInWei = ethers.parseEther(price);

      // Purchase report using contract owner's wallet (backend)
      const tx = await this.homeFaxContract.purchaseReport(reportId, {
        value: priceInWei
      });
      await tx.wait();
      
      this.logger.log(`Report ${reportId} purchased successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to purchase report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets a property from the HomeFax contract
   * @param userAddress The Ethereum address of the user
   * @param propertyId The ID of the property
   */
  async getProperty(userAddress: string, propertyId: number): Promise<any> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Get property
      const property = await this.homeFaxContract.getProperty(propertyId);
      
      return {
        id: Number(property.id),
        propertyAddress: property.propertyAddress,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        owner: property.owner,
        createdAt: new Date(Number(property.createdAt) * 1000),
        updatedAt: new Date(Number(property.updatedAt) * 1000),
        isVerified: property.isVerified
      };
    } catch (error) {
      this.logger.error(`Failed to get property: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets a report from the HomeFax contract
   * @param userAddress The Ethereum address of the user
   * @param reportId The ID of the report
   */
  async getReport(userAddress: string, reportId: number): Promise<any> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Get report
      const report = await this.homeFaxContract.getReport(reportId);
      
      return {
        id: Number(report.id),
        propertyId: Number(report.propertyId),
        reportType: report.reportType,
        reportHash: report.reportHash,
        creator: report.creator,
        price: ethers.formatEther(report.price),
        createdAt: new Date(Number(report.createdAt) * 1000),
        isVerified: report.isVerified
      };
    } catch (error) {
      this.logger.error(`Failed to get report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets the report content from the HomeFax contract
   * @param userAddress The Ethereum address of the user
   * @param reportId The ID of the report
   */
  async getReportContent(userAddress: string, reportId: number): Promise<string> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Get report content
      const reportHash = await this.homeFaxContract.getReportContent(reportId);
      
      // In a real application, you would fetch the content from IPFS using this hash
      return reportHash;
    } catch (error) {
      this.logger.error(`Failed to get report content: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets all properties owned by a user
   * @param userAddress The Ethereum address of the user
   */
  async getUserProperties(userAddress: string): Promise<number[]> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Get user properties
      const propertyIds = await this.homeFaxContract.getUserProperties(userAddress);
      
      return propertyIds.map(id => Number(id));
    } catch (error) {
      this.logger.error(`Failed to get user properties: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets all reports for a property
   * @param userAddress The Ethereum address of the user
   * @param propertyId The ID of the property
   */
  async getPropertyReports(userAddress: string, propertyId: number): Promise<number[]> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Get property reports
      const reportIds = await this.homeFaxContract.getPropertyReports(propertyId);
      
      return reportIds.map(id => Number(id));
    } catch (error) {
      this.logger.error(`Failed to get property reports: ${error.message}`);
      throw error;
    }
  }

  /**
   * Checks if a user has purchased a report
   * @param userAddress The Ethereum address of the user
   * @param reportId The ID of the report
   */
  async hasPurchasedReport(userAddress: string, reportId: number): Promise<boolean> {
    try {
      // Ensure user is authorized
      await this.authorizeUser(userAddress);

      // Check if user has purchased report
      return await this.homeFaxContract.hasPurchasedReport(userAddress, reportId);
    } catch (error) {
      this.logger.error(`Failed to check if user has purchased report: ${error.message}`);
      throw error;
    }
  }
}