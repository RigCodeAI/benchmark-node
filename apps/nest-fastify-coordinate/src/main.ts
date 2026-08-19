import "reflect-metadata";

import { Controller, Get, Module, Query } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import * as vm from "node:vm";

@Controller("api")
class EvaluationController {
  @Get("evaluate")
  evaluate(@Query("input") input: string): string {
    try {
      return String(vm.runInNewContext(input));
    } catch {
      return "invalid expression";
    }
  }
}

@Module({ controllers: [EvaluationController] })
class ApplicationModule {}

async function start(): Promise<void> {
  const application = await NestFactory.create(
    ApplicationModule,
    new FastifyAdapter(),
    { logger: false },
  );
  await application.listen(
    Number(process.env.PORT),
    process.env.HOST || "127.0.0.1",
  );
}

void start();
