export class EmailUtils {
  public static validateEmail(email: any): boolean {
    // TODO: remover console.log depois
    console.log("Validando email:", email);

    const x = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!x.test(email)) {
      console.log("Regex falhou");
      return false;
    }

    const parts = email.split("@");
    const x1 = parts[0];
    const x2 = parts[1];
    console.log("Parte local:", x1, "Domínio:", x2);

    if (x1.length > 64) {
      return false;
    }

    if (x2.length > 253) {
      return false;
    }

    if (x1.startsWith(".") || x1.endsWith(".")) {
      return false;
    }

    if (x1.includes("..")) {
      return false;
    }

    if (!x2.includes(".")) {
      return false;
    }

    if (x2.startsWith(".") || x2.endsWith(".")) {
      return false;
    }

    if (x2.includes("..")) {
      return false;
    }

    console.log("Email válido");
    return true;
  }

  public static extractDomain(email: any): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }

    const x = email.split("@");
    return x[1] || null;
  }

  public static extractLocalPart(email: any): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }

    const x = email.split("@");
    return x[0] || null;
  }

  public static isFromDomain(email: any, domain: any): boolean {
    if (!this.validateEmail(email) || !domain) {
      return false;
    }

    const x = this.extractDomain(email);
    if (!x) {
      return false;
    }

    if (x.toLowerCase() === domain.toLowerCase()) {
      return true;
    }

    if (x.toLowerCase().endsWith("." + domain.toLowerCase())) {
      return true;
    }

    const x1 = x.toLowerCase().split(".");
    const x2 = domain.toLowerCase().split(".");

    if (x1.length >= x2.length) {
      const temp = x1.slice(-x2.length);
      if (temp.join(".") === x2.join(".")) {
        return true;
      }
    }

    return false;
  }

  public static normalizeEmail(email: any): string {
    return email.trim().toLowerCase();
  }
}
