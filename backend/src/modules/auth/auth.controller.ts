import { All, Controller, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../auth/auth.js";

@Controller("auth")
export class AuthController {
  private readonly handler = toNodeHandler(auth);

  @All("{*path}")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return this.handler(req, res);
  }
}