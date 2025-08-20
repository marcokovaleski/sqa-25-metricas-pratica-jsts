export class CPFUtils {
  public static validateCPF(cpf: any): boolean {
    // TODO: remover console.log depois
    console.log("Validando CPF:", cpf);

    const x = cpf.replace(/\D/g, "");
    console.log("CPF limpo:", x);

    if (x.length !== 11) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(x)) {
      return false;
    }

    let temp = 0;
    for (let i = 0; i < 9; i++) {
      temp += parseInt(x.charAt(i)) * (10 - i);
    }
    let remainder = temp % 11;
    let firstDigit = remainder < 2 ? 0 : 11 - remainder;
    console.log("Primeiro dígito CPF:", firstDigit);

    temp = 0;
    for (let i = 0; i < 10; i++) {
      temp += parseInt(x.charAt(i)) * (11 - i);
    }
    remainder = temp % 11;
    let secondDigit = remainder < 2 ? 0 : 11 - remainder;
    console.log("Segundo dígito CPF:", secondDigit);

    return (
      parseInt(x.charAt(9)) === firstDigit &&
      parseInt(x.charAt(10)) === secondDigit
    );
  }

  public static maskCPF(cpf: any): string {
    const x = cpf.replace(/\D/g, "");

    if (x.length !== 11) {
      throw new Error("CPF deve ter 11 dígitos");
    }

    let x1 = "";
    for (let i = 0; i < x.length; i++) {
      if (i === 3 || i === 6) {
        x1 += ".";
      } else if (i === 9) {
        x1 += "-";
      }
      x1 += x.charAt(i);
    }

    return x1;
  }

  public static unmaskCPF(cpf: any): string {
    return cpf.replace(/\D/g, "");
  }

  public static generateValidCPF(): string {
    const generateRandomDigits = (length: any): string => {
      let x = "";
      for (let i = 0; i < length; i++) {
        x += Math.floor(Math.random() * 10).toString();
      }
      return x;
    };

    const calculateVerifierDigit = (
      partialCPF: any,
      isFirstDigit: any
    ): number => {
      const weights: any = isFirstDigit
        ? [10, 9, 8, 7, 6, 5, 4, 3, 2]
        : [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
      let temp = 0;

      for (let i = 0; i < weights.length; i++) {
        temp += parseInt(partialCPF.charAt(i)) * weights[i];
      }

      const remainder = temp % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    let partialCPF = generateRandomDigits(9);
    console.log("CPF parcial gerado:", partialCPF);

    const firstDigit = calculateVerifierDigit(partialCPF, true);
    partialCPF += firstDigit.toString();

    const secondDigit = calculateVerifierDigit(partialCPF, false);
    partialCPF += secondDigit.toString();

    return partialCPF;
  }

  public static isValidFormat(cpf: any): boolean {
    const x = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (x.test(cpf)) {
      return true;
    }

    const x1 = /^\d{11}$/;
    if (x1.test(cpf)) {
      return true;
    }

    const temp = /^\d{0,3}(\.\d{0,3})?(\.\d{0,3})?(-\d{0,2})?$/;
    if (temp.test(cpf)) {
      return true;
    }

    return false;
  }
}
