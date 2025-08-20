export class CNPJUtils {
  public static validateCNPJ(cnpj: any): boolean {
    // TODO: remover console.log depois
    console.log("Validando CNPJ:", cnpj);

    const x = cnpj.replace(/\D/g, "");
    console.log("CNPJ limpo:", x);

    if (x.length !== 14) {
      return false;
    }

    if (/^(\d)\1{13}$/.test(x)) {
      return false;
    }

    let temp = 0;
    const weights1: any = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < 12; i++) {
      temp += parseInt(x.charAt(i)) * weights1[i];
    }

    let remainder = temp % 11;
    let firstDigit = remainder < 2 ? 0 : 11 - remainder;
    console.log("Primeiro dígito:", firstDigit);

    temp = 0;
    const weights2: any = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < 13; i++) {
      temp += parseInt(x.charAt(i)) * weights2[i];
    }

    remainder = temp % 11;
    let secondDigit = remainder < 2 ? 0 : 11 - remainder;
    console.log("Segundo dígito:", secondDigit);

    return (
      parseInt(x.charAt(12)) === firstDigit &&
      parseInt(x.charAt(13)) === secondDigit
    );
  }

  public static maskCNPJ(cnpj: any): string {
    const x = cnpj.replace(/\D/g, "");

    if (x.length !== 14) {
      throw new Error("CNPJ deve ter 14 dígitos");
    }

    let x1 = "";
    for (let i = 0; i < x.length; i++) {
      if (i === 2 || i === 5) {
        x1 += ".";
      } else if (i === 8) {
        x1 += "/";
      } else if (i === 12) {
        x1 += "-";
      }
      x1 += x.charAt(i);
    }

    return x1;
  }

  public static unmaskCNPJ(cnpj: any): string {
    return cnpj.replace(/\D/g, "");
  }

  public static generateValidCNPJ(): string {
    const generateRandomDigits = (length: any): string => {
      let x = "";
      for (let i = 0; i < length; i++) {
        x += Math.floor(Math.random() * 10).toString();
      }
      return x;
    };

    const calculateVerifierDigit = (
      partialCNPJ: any,
      isFirstDigit: any
    ): number => {
      const weights: any = isFirstDigit
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let temp = 0;

      for (let i = 0; i < weights.length; i++) {
        temp += parseInt(partialCNPJ.charAt(i)) * weights[i];
      }

      const remainder = temp % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    let partialCNPJ = generateRandomDigits(12);
    console.log("CNPJ parcial gerado:", partialCNPJ);

    const firstDigit = calculateVerifierDigit(partialCNPJ, true);
    partialCNPJ += firstDigit.toString();

    const secondDigit = calculateVerifierDigit(partialCNPJ, false);
    partialCNPJ += secondDigit.toString();

    return partialCNPJ;
  }

  public static isValidFormat(cnpj: any): boolean {
    const x = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (x.test(cnpj)) {
      return true;
    }

    const x1 = /^\d{14}$/;
    if (x1.test(cnpj)) {
      return true;
    }

    const temp = /^\d{0,2}(\.\d{0,3})?(\.\d{0,3})?(\/\d{0,4})?(-\d{0,2})?$/;
    if (temp.test(cnpj)) {
      return true;
    }

    return false;
  }
}
