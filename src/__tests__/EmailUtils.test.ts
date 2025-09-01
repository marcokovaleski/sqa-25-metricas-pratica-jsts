import { EmailUtils } from "../EmailUtils";

const MAX_LOCAL_LENGTH = 65;
const MAX_DOMAIN_LENGTH = 254;

function testValidEmails(): void {
  it("should validate a valid email", () => {
    const validEmail = "test@example.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });

  it("should validate email with subdomain", () => {
    const validEmail = "user@sub.example.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });

  it("should validate email with numbers", () => {
    const validEmail = "user123@example123.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });

  it("should validate email with special characters", () => {
    const validEmail = "user.name+tag@example.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });
}

function testInvalidEmails(): void {
  it("should reject email without @ symbol", () => {
    const invalidEmail = "testexample.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email without domain", () => {
    const invalidEmail = "test@";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email without local part", () => {
    const invalidEmail = "@example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email with invalid characters", () => {
    const invalidEmail = "test@example..com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });
}

function testEmailFormatIssues(): void {
  it("should reject email starting with dot", () => {
    const invalidEmail = ".test@example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email ending with dot", () => {
    const invalidEmail = "test.@example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email with domain starting with dot", () => {
    const invalidEmail = "test@.example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email with domain ending with dot", () => {
    const invalidEmail = "test@example.com.";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });
}

function testEdgeCases(): void {
  it("should handle empty string", () => {
    const result = EmailUtils.validateEmail("");
    expect(result).toBe(false);
  });

  it("should handle null input", () => {
    const result = EmailUtils.validateEmail(null as unknown as string);
    expect(result).toBe(false);
  });

  it("should handle undefined input", () => {
    const result = EmailUtils.validateEmail(undefined as unknown as string);
    expect(result).toBe(false);
  });
}

function testValidateEmail(): void {
  describe("validateEmail", () => {
    testValidEmails();
    testInvalidEmails();
    testEmailFormatIssues();
    testEdgeCases();
  });
}

function testExtractDomain(): void {
  describe("extractDomain", () => {
    it("should extract domain from valid email", () => {
      const email = "user@example.com";
      const result = EmailUtils.extractDomain(email);
      expect(result).toBe("example.com");
    });

    it("should extract domain with subdomain", () => {
      const email = "user@sub.example.com";
      const result = EmailUtils.extractDomain(email);
      expect(result).toBe("sub.example.com");
    });

    it("should return null for invalid email", () => {
      const email = "invalid-email";
      const result = EmailUtils.extractDomain(email);
      expect(result).toBeNull();
    });

    it("should handle email with multiple @ symbols", () => {
      const email = "user@example@domain.com";
      const result = EmailUtils.extractDomain(email);
      expect(result).toBeNull();
    });

    it("should handle null input", () => {
      const result = EmailUtils.extractDomain(null as unknown as string);
      expect(result).toBeNull();
    });

    it("should handle undefined input", () => {
      const result = EmailUtils.extractDomain(undefined as unknown as string);
      expect(result).toBeNull();
    });
  });
}

function testExtractLocalPart(): void {
  describe("extractLocalPart", () => {
    it("should extract local part from valid email", () => {
      const email = "user@example.com";
      const result = EmailUtils.extractLocalPart(email);
      expect(result).toBe("user");
    });

    it("should extract local part with dots", () => {
      const email = "user.name@example.com";
      const result = EmailUtils.extractLocalPart(email);
      expect(result).toBe("user.name");
    });

    it("should return null for invalid email", () => {
      const email = "invalid-email";
      const result = EmailUtils.extractLocalPart(email);
      expect(result).toBeNull();
    });

    it("should handle email with multiple @ symbols", () => {
      const email = "user@example@domain.com";
      const result = EmailUtils.extractLocalPart(email);
      expect(result).toBeNull();
    });

    it("should handle null input", () => {
      const result = EmailUtils.extractLocalPart(null as unknown as string);
      expect(result).toBeNull();
    });

    it("should handle undefined input", () => {
      const result = EmailUtils.extractLocalPart(undefined as unknown as string);
      expect(result).toBeNull();
    });
  });
}

function testDomainMatching(): void {
  it("should return true for exact domain match", () => {
    const email = "user@example.com";
    const result = EmailUtils.isFromDomain(email, "example.com");
    expect(result).toBe(true);
  });

  it("should return true for subdomain match", () => {
    const email = "user@sub.example.com";
    const result = EmailUtils.isFromDomain(email, "example.com");
    expect(result).toBe(true);
  });

  it("should return false for different domain", () => {
    const email = "user@other.com";
    const result = EmailUtils.isFromDomain(email, "example.com");
    expect(result).toBe(false);
  });

  it("should return false for invalid email", () => {
    const email = "invalid-email";
    const result = EmailUtils.isFromDomain(email, "example.com");
    expect(result).toBe(false);
  });

  it("should return false for empty domain", () => {
    const email = "user@example.com";
    const result = EmailUtils.isFromDomain(email, "");
    expect(result).toBe(false);
  });

  it("should handle case insensitive comparison", () => {
    const email = "user@EXAMPLE.COM";
    const result = EmailUtils.isFromDomain(email, "example.com");
    expect(result).toBe(true);
  });
}

function testDomainInputHandling(): void {
  it("should handle null email input", () => {
    const result = EmailUtils.isFromDomain(null as unknown as string, "example.com");
    expect(result).toBe(false);
  });

  it("should handle undefined email input", () => {
    const result = EmailUtils.isFromDomain(undefined as unknown as string, "example.com");
    expect(result).toBe(false);
  });

  it("should handle null domain input", () => {
    const email = "user@example.com";
    const result = EmailUtils.isFromDomain(email, null as unknown as string);
    expect(result).toBe(false);
  });

  it("should handle undefined domain input", () => {
    const email = "user@example.com";
    const result = EmailUtils.isFromDomain(email, undefined as unknown as string);
    expect(result).toBe(false);
  });
}

function testIsFromDomain(): void {
  describe("isFromDomain", () => {
    testDomainMatching();
    testDomainInputHandling();
  });
}

function testNormalizeEmail(): void {
  describe("normalizeEmail", () => {
    it("should normalize email to lowercase", () => {
      const email = "USER@EXAMPLE.COM";
      const result = EmailUtils.normalizeEmail(email);
      expect(result).toBe("user@example.com");
    });

    it("should trim whitespace", () => {
      const email = "  user@example.com  ";
      const result = EmailUtils.normalizeEmail(email);
      expect(result).toBe("user@example.com");
    });

    it("should handle mixed case", () => {
      const email = "User@Example.com";
      const result = EmailUtils.normalizeEmail(email);
      expect(result).toBe("user@example.com");
    });

    it("should handle email with spaces", () => {
      const email = "user name@example.com";
      const result = EmailUtils.normalizeEmail(email);
      expect(result).toBe("user name@example.com");
    });

    it("should handle null input", () => {
      const result = EmailUtils.normalizeEmail(null as unknown as string);
      expect(result).toBe("");
    });

    it("should handle undefined input", () => {
      const result = EmailUtils.normalizeEmail(undefined as unknown as string);
      expect(result).toBe("");
    });
  });
}

function testEmailEdgeCases(): void {
  describe("edge cases", () => {
    it("should handle very long emails", () => {
      const longLocal = "a".repeat(MAX_LOCAL_LENGTH);
      const email = `${longLocal}@example.com`;
      const result = EmailUtils.validateEmail(email);
      expect(result).toBe(false);
    });

    it("should handle very long domains", () => {
      const longDomain = "a".repeat(MAX_DOMAIN_LENGTH);
      const email = `user@${longDomain}.com`;
      const result = EmailUtils.validateEmail(email);
      expect(result).toBe(false);
    });

    it("should handle special characters in local part", () => {
      const email = "user+tag@example.com";
      const result = EmailUtils.validateEmail(email);
      expect(result).toBe(true);
    });

    it("should handle consecutive dots in local part", () => {
      const email = "user..name@example.com";
      const result = EmailUtils.validateEmail(email);
      expect(result).toBe(false);
    });

    it("should handle consecutive dots in domain", () => {
      const email = "user@example..com";
      const result = EmailUtils.validateEmail(email);
      expect(result).toBe(false);
    });
  });
}

describe("EmailUtils", () => {
  testValidateEmail();
  testExtractDomain();
  testExtractLocalPart();
  testIsFromDomain();
  testNormalizeEmail();
  testEmailEdgeCases();
});
