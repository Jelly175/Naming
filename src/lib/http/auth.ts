import type { NextRequest } from "next/server";

export class ApiAuthError extends Error {
  constructor(message = "Authentication is required.") {
    super(message);
    this.name = "ApiAuthError";
  }
}

export function getRequiredUserId(request: NextRequest) {
  const rawUserId = request.headers.get("x-user-id");

  if (!rawUserId) {
    throw new ApiAuthError();
  }

  if (!/^\d+$/.test(rawUserId)) {
    throw new ApiAuthError("Invalid user identifier.");
  }

  const userId = BigInt(rawUserId);

  if (userId <= BigInt(0)) {
    throw new ApiAuthError("Invalid user identifier.");
  }

  return userId;
}

export function getOptionalUserId(request: NextRequest) {
  const rawUserId = request.headers.get("x-user-id");

  if (!rawUserId) {
    return undefined;
  }

  return getRequiredUserId(request);
}
