import type { CookieOptions, Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const registeredUser = await authService.register(req.body);
  return res
    .status(201)
    .json(
      new ApiResponse(true, "User registered successfully", registeredUser),
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await authService.login(req.body);

  const cookieOptions: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure: true,
  };

  res.cookie("access_token", accessToken, cookieOptions);
  res.cookie("refresh_token", refreshToken, cookieOptions);

  return res
    .status(200)
    .json(
      new ApiResponse(true, "Login successful", { token: accessToken, user }),
    );
});

export const authController = {
  registerUser,
  loginUser,
};
