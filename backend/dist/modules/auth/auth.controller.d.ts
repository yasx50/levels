import type { Request, Response } from "express";
export declare class AuthController {
    private readonly handler;
    handleAuth(req: Request, res: Response): Promise<void>;
}
