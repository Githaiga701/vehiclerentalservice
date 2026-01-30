export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;
  user!: {
    id: string;
    phone: string;
    name: string | null;
    email: string | null;
    role: string;
  };
}
