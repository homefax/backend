import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger API documentation setup
  const config = new DocumentBuilder()
    .setTitle("HomeFax API")
    .setDescription("The HomeFax API documentation")
    .setVersion("1.0")
    .addTag("properties")
    .addTag("auth")
    .addTag("reports")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save Swagger JSON to file for external documentation
  fs.writeFileSync("./docs/swagger.json", JSON.stringify(document, null, 2));

  // Setup Swagger UI
  SwaggerModule.setup("api/docs", app, document);

  // Start the server
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/api/docs`
  );
}

bootstrap();
