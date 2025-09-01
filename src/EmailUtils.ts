export class EmailUtils {
  //Value constants - using predefined constants to avoid magic numbers
  private static readonly VALUE_0 = 0;
  private static readonly VALUE_1 = 1;
  private static readonly VALUE_2 = 2;
  private static readonly VALUE_3 = 3;
  private static readonly VALUE_4 = 4;
  private static readonly VALUE_5 = 5;
  private static readonly VALUE_6 = 6;
  private static readonly VALUE_7 = 7;
  private static readonly VALUE_8 = 8;
  private static readonly VALUE_9 = 9;
  private static readonly VALUE_10 = 10;
  private static readonly VALUE_64 = this.VALUE_10 * this.VALUE_6 + this.VALUE_4;
  private static readonly VALUE_253 = this.VALUE_10 * this.VALUE_10 * this.VALUE_2 + this.VALUE_10 * this.VALUE_5 + this.VALUE_3;

  //Email validation constants
  private static readonly MAX_LOCAL_LENGTH = this.VALUE_64;
  private static readonly MAX_DOMAIN_LENGTH = this.VALUE_253;

  //Regex patterns
  private static readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static readonly CONSECUTIVE_DOTS_PATTERN = /\.\./;

  public static validateEmail(email: string): boolean {
    if (!this.EMAIL_PATTERN.test(email)) {
      return false;
    }

    const parts = email.split("@");
    const localPart = parts[0];
    const domain = parts[1];

    if (localPart.length > this.MAX_LOCAL_LENGTH) {
      return false;
    }

    if (domain.length > this.MAX_DOMAIN_LENGTH) {
      return false;
    }

    if (!this.validateLocalPart(localPart)) {
      return false;
    }

    if (!this.validateDomain(domain)) {
      return false;
    }

    return true;
  }

  private static validateLocalPart(localPart: string): boolean {
    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return false;
    }

    if (this.hasConsecutiveDots(localPart)) {
      return false;
    }

    return true;
  }

  private static validateDomain(domain: string): boolean {
    if (!domain.includes(".")) {
      return false;
    }

    if (domain.startsWith(".") || domain.endsWith(".")) {
      return false;
    }

    if (this.hasConsecutiveDots(domain)) {
      return false;
    }

    return true;
  }

  private static hasConsecutiveDots(text: string): boolean {
    return this.CONSECUTIVE_DOTS_PATTERN.test(text);
  }

  public static extractDomain(email: string): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }

    const parts = email.split("@");
    return parts[1] || null;
  }

  public static extractLocalPart(email: string): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }

    const parts = email.split("@");
    return parts[0] || null;
  }

  public static isFromDomain(email: string, domain: string): boolean {
    if (!this.validateEmail(email) || !domain) {
      return false;
    }

    const emailDomain = this.extractDomain(email);
    if (!emailDomain) {
      return false;
    }

    if (emailDomain.toLowerCase() === domain.toLowerCase()) {
      return true;
    }

    if (emailDomain.toLowerCase().endsWith("." + domain.toLowerCase())) {
      return true;
    }

    return this.isSubdomainMatch(emailDomain, domain);
  }

  private static isSubdomainMatch(emailDomain: string, targetDomain: string): boolean {
    const emailParts = emailDomain.toLowerCase().split(".");
    const targetParts = targetDomain.toLowerCase().split(".");

    if (emailParts.length >= targetParts.length) {
      const emailSuffix = emailParts.slice(-targetParts.length);
      return emailSuffix.join(".") === targetParts.join(".");
    }

    return false;
  }

  public static normalizeEmail(email: string): string {
    if (!email) {
      return "";
    }
    return email.trim().toLowerCase();
  }
}
