import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("jose", () => ({
  SignJWT: vi.fn(),
  jwtVerify: vi.fn(),
}));

// Import after mocks
import {
  createSession,
  getSession,
  deleteSession,
  verifySession,
  type SessionPayload,
} from "../auth";

// Mock environment
const originalEnv = process.env;
beforeEach(() => {
  vi.clearAllMocks();
  process.env = { ...originalEnv, NODE_ENV: "development" };
});

afterEach(() => {
  process.env = originalEnv;
});

// Mock cookie store
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

const mockCookies = vi.mocked(cookies);
mockCookies.mockResolvedValue(mockCookieStore as any);

describe("createSession", () => {
  const userId = "user-123";
  const email = "test@example.com";

  beforeEach(() => {
    mockCookieStore.set.mockClear();
  });

  it("creates a session with valid JWT token", async () => {
    const mockSign = vi.fn().mockResolvedValue("mock-jwt-token");
    vi.mocked(SignJWT).mockReturnValue({
      setProtectedHeader: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      sign: mockSign,
    } as any);

    await createSession(userId, email);

    expect(SignJWT).toHaveBeenCalledWith({
      userId,
      email,
      expiresAt: expect.any(Date),
    });
    expect(mockSign).toHaveBeenCalled();
  });

  it("sets cookie with correct attributes", async () => {
    const mockSign = vi.fn().mockResolvedValue("mock-jwt-token");
    vi.mocked(SignJWT).mockReturnValue({
      setProtectedHeader: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      sign: mockSign,
    } as any);

    await createSession(userId, email);

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "auth-token",
      "mock-jwt-token",
      {
        httpOnly: true,
        secure: false, // development
        sameSite: "lax",
        expires: expect.any(Date),
        path: "/",
      }
    );
  });

  it("sets secure cookie in production", async () => {
    (process.env as any).NODE_ENV = "production";

    const mockSign = vi.fn().mockResolvedValue("mock-jwt-token");
    vi.mocked(SignJWT).mockReturnValue({
      setProtectedHeader: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      sign: mockSign,
    } as any);

    await createSession(userId, email);

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "auth-token",
      "mock-jwt-token",
      expect.objectContaining({ secure: true })
    );
  });

  it("uses fallback JWT secret in development", async () => {
    delete process.env.JWT_SECRET;

    const mockSign = vi.fn().mockResolvedValue("mock-jwt-token");
    vi.mocked(SignJWT).mockReturnValue({
      setProtectedHeader: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      sign: mockSign,
    } as any);

    await createSession(userId, email);

    // Should still work with fallback secret
    expect(mockSign).toHaveBeenCalled();
  });
});

describe("getSession", () => {
  it("returns session payload for valid token", async () => {
    const mockPayload: SessionPayload = {
      userId: "user-123",
      email: "test@example.com",
      expiresAt: new Date(Date.now() + 86400000),
    };

    mockCookieStore.get.mockReturnValue({ value: "valid-token" });
    vi.mocked(jwtVerify).mockResolvedValue({ payload: mockPayload } as any);

    const result = await getSession();

    expect(result).toEqual(mockPayload);
    expect(mockCookieStore.get).toHaveBeenCalledWith("auth-token");
  });

  it("returns null when no cookie exists", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getSession();

    expect(result).toBeNull();
  });

  it("returns null for invalid token", async () => {
    mockCookieStore.get.mockReturnValue({ value: "invalid-token" });
    vi.mocked(jwtVerify).mockRejectedValue(new Error("Invalid token"));

    const result = await getSession();

    expect(result).toBeNull();
  });

  it("returns null when cookie has no value", async () => {
    mockCookieStore.get.mockReturnValue({ value: undefined });

    const result = await getSession();

    expect(result).toBeNull();
  });
});

describe("deleteSession", () => {
  it("deletes the auth cookie", async () => {
    await deleteSession();

    expect(mockCookieStore.delete).toHaveBeenCalledWith("auth-token");
  });
});

describe("verifySession", () => {
  it("returns session payload from request", async () => {
    const mockPayload: SessionPayload = {
      userId: "user-123",
      email: "test@example.com",
      expiresAt: new Date(Date.now() + 86400000),
    };

    const mockRequest = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: "valid-token" }),
      },
    } as unknown as NextRequest;

    vi.mocked(jwtVerify).mockResolvedValue({ payload: mockPayload } as any);

    const result = await verifySession(mockRequest);

    expect(result).toEqual(mockPayload);
  });

  it("returns null when no token in request", async () => {
    const mockRequest = {
      cookies: {
        get: vi.fn().mockReturnValue(undefined),
      },
    } as unknown as NextRequest;

    const result = await verifySession(mockRequest);

    expect(result).toBeNull();
  });

  it("returns null for invalid token in request", async () => {
    const mockRequest = {
      cookies: {
        get: vi.fn().mockReturnValue({ value: "invalid-token" }),
      },
    } as unknown as NextRequest;

    vi.mocked(jwtVerify).mockRejectedValue(new Error("Invalid token"));

    const result = await verifySession(mockRequest);

    expect(result).toBeNull();
  });
});