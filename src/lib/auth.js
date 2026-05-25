import { jwtVerify } from "jose";

export async function getAuthPayload(request) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_secret_key_change_in_production"
  );

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
