import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BlockchainService } from "./blockchain.service";
import { BlockchainController } from "./blockchain.controller";
import { EthStorageModule } from "../ethstorage/ethstorage.module";

@Module({
  imports: [ConfigModule, EthStorageModule],
  controllers: [BlockchainController],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
