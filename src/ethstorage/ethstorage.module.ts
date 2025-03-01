import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EthStorageService } from "./ethstorage.service";
import { EthStorageController } from "./ethstorage.controller";

@Module({
  imports: [ConfigModule],
  controllers: [EthStorageController],
  providers: [EthStorageService],
  exports: [EthStorageService],
})
export class EthStorageModule {}
