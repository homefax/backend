export interface JwtPayload {
  sub: string;
  email?: string;
  walletAddress?: string;
  iat?: number;
  exp?: number;
}
