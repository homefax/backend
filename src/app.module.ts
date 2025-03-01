import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { UserModule } from "./user/user.module";
import { EthStorageModule } from "./ethstorage/ethstorage.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "postgres"),
        database: configService.get("DB_DATABASE", "homefax"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<boolean>("DB_SYNC", false),
        logging: configService.get<boolean>("DB_LOGGING", false),
      }),
    }),

    // Feature modules
    AuthModule,
    UserModule,
    BlockchainModule,
    EthStorageModule,
    // PropertyModule, // Uncomment when implemented
    // ReportModule,   // Uncomment when implemented
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
