import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getStatus(): { status: string; version: string } {
    return {
      status: "online",
      version: "1.0.0",
    };
  }
}
