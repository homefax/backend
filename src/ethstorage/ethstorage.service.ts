import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const { FlatDirectory } = require("ethstorage-sdk");

@Injectable()
export class EthStorageService implements OnModuleInit {
  private readonly logger = new Logger(EthStorageService.name);
  private flatDirectory: any;
  private contractAddress: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      // Initialize EthStorage
      const rpc =
        this.configService.get<string>("ETHSTORAGE_RPC_URL") ||
        "https://rpc.beta.testnet.l2.quarkchain.io:8545";
      const privateKey = this.configService.get<string>(
        "ETHSTORAGE_PRIVATE_KEY"
      );

      if (!privateKey) {
        this.logger.warn(
          "ETHSTORAGE_PRIVATE_KEY not found in environment variables. EthStorage functionality will be limited."
        );
        return;
      }

      this.flatDirectory = await FlatDirectory.create({
        rpc,
        privateKey,
      });

      this.contractAddress = await this.flatDirectory.deploy();
      this.logger.log(
        `EthStorage FlatDirectory deployed at address: ${this.contractAddress}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to initialize EthStorage service: ${error.message}`
      );
    }
  }

  /**
   * Uploads a file to EthStorage
   * @param fileName The name of the file
   * @param fileContent The content of the file as a Buffer or string
   * @returns The file ID in EthStorage
   */
  async uploadFile(
    fileName: string,
    fileContent: Buffer | string
  ): Promise<string> {
    try {
      if (!this.flatDirectory) {
        throw new Error("EthStorage not initialized");
      }

      // Upload file to EthStorage
      const fileId = await this.flatDirectory.uploadFile(fileName, fileContent);
      this.logger.log(`File uploaded to EthStorage with ID: ${fileId}`);

      return fileId;
    } catch (error) {
      this.logger.error(
        `Failed to upload file to EthStorage: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Downloads a file from EthStorage
   * @param fileId The ID of the file to download
   * @returns The file content as a Buffer
   */
  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      if (!this.flatDirectory) {
        throw new Error("EthStorage not initialized");
      }

      // Download file from EthStorage
      const fileContent = await this.flatDirectory.downloadFile(fileId);
      this.logger.log(`File downloaded from EthStorage with ID: ${fileId}`);

      return fileContent;
    } catch (error) {
      this.logger.error(
        `Failed to download file from EthStorage: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Lists all files in the EthStorage directory
   * @returns An array of file information
   */
  async listFiles(): Promise<any[]> {
    try {
      if (!this.flatDirectory) {
        throw new Error("EthStorage not initialized");
      }

      // List files in EthStorage
      const files = await this.flatDirectory.listFiles();
      this.logger.log(`Listed ${files.length} files from EthStorage`);

      return files;
    } catch (error) {
      this.logger.error(
        `Failed to list files from EthStorage: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Gets the contract address of the deployed FlatDirectory
   * @returns The contract address
   */
  getContractAddress(): string {
    return this.contractAddress;
  }
}
