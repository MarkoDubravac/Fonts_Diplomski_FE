import { JwtPayload } from "jwt-decode";

export interface CustomJWTPayload extends JwtPayload {
  role?: string;
}
