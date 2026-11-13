import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { BetterAuthGuard } from "./better-auth.guard.js";

@Module({
  controllers: [AuthController],
  providers: [BetterAuthGuard],
  exports: [BetterAuthGuard],
})
export class AuthModule {}
