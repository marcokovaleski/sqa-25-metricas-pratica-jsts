export class CPFUtils {
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
  private static readonly VALUE_11 = this.VALUE_10 + this.VALUE_1;

  //Weight value constants
  private static readonly WEIGHT_10 = this.VALUE_10;
  private static readonly WEIGHT_9 = this.VALUE_9;
  private static readonly WEIGHT_8 = this.VALUE_8;
  private static readonly WEIGHT_7 = this.VALUE_7;
  private static readonly WEIGHT_6 = this.VALUE_6;
  private static readonly WEIGHT_5 = this.VALUE_5;
  private static readonly WEIGHT_4 = this.VALUE_4;
  private static readonly WEIGHT_3 = this.VALUE_3;
  private static readonly WEIGHT_2 = this.VALUE_2;

  //CPF specific constants
  private static readonly CPF_LENGTH = this.VALUE_11;
  private static readonly PARTIAL_CPF_LENGTH = 9;
  private static readonly FIRST_DIGIT_INDEX = 9;
  private static readonly SECOND_DIGIT_INDEX = 10;

  //Algorithm constants
  private static readonly REMAINDER_THRESHOLD = this.VALUE_2;
  private static readonly SUBTRACTION_VALUE = this.VALUE_11;
  private static readonly FIRST_WEIGHTS_LENGTH = 9;
  private static readonly SECOND_WEIGHTS_LENGTH = 10;

  //Position constants
  private static readonly FIRST_DOT_POSITION = 3;
  private static readonly SECOND_DOT_POSITION = 6;
  private static readonly HYPHEN_POSITION = 9;

  //Weight arrays for digit calculation
  private static readonly FIRST_WEIGHTS = [
    this.WEIGHT_10, this.WEIGHT_9, this.WEIGHT_8, this.WEIGHT_7, this.WEIGHT_6,
    this.WEIGHT_5, this.WEIGHT_4, this.WEIGHT_3, this.WEIGHT_2
  ];
  private static readonly SECOND_WEIGHTS = [
    this.VALUE_11, this.WEIGHT_10, this.WEIGHT_9, this.WEIGHT_8, this.WEIGHT_7,
    this.WEIGHT_6, this.WEIGHT_5, this.WEIGHT_4, this.WEIGHT_3, this.WEIGHT_2
  ];

  //Regex patterns
  private static readonly ALL_SAME_DIGITS_PATTERN = /^(\d)\1{10}$/;
  private static readonly MASKED_FORMAT_PATTERN = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  private static readonly UNMASKED_FORMAT_PATTERN = /^\d{11}$/;
  private static readonly PARTIAL_FORMAT_PATTERN = /^\d{0,3}(\.\d{0,3})?(\.\d{0,3})?(-\d{0,2})?$/;

  public static validateCPF(cpf: string): boolean {
    const cleanedCPF = this.cleanCPF(cpf);

    if (cleanedCPF.length !== this.CPF_LENGTH) {
      return false;
    }

    if (this.hasAllSameDigits(cleanedCPF)) {
      return false;
    }

    const firstDigit = this.calculateFirstDigit(cleanedCPF);
    const secondDigit = this.calculateSecondDigit(cleanedCPF);

    return (
      parseInt(cleanedCPF.charAt(this.FIRST_DIGIT_INDEX)) === firstDigit &&
      parseInt(cleanedCPF.charAt(this.SECOND_DIGIT_INDEX)) === secondDigit
    );
  }

  private static cleanCPF(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  private static hasAllSameDigits(cpf: string): boolean {
    return this.ALL_SAME_DIGITS_PATTERN.test(cpf);
  }

  private static calculateFirstDigit(cpf: string): number {
    let sum = 0;
    for (let i = 0; i < this.FIRST_WEIGHTS_LENGTH; i++) {
      sum += parseInt(cpf.charAt(i)) * this.FIRST_WEIGHTS[i];
    }
    const remainder = sum % this.SUBTRACTION_VALUE;
    return remainder < this.REMAINDER_THRESHOLD ? 0 : this.SUBTRACTION_VALUE - remainder;
  }

  private static calculateSecondDigit(cpf: string): number {
    let sum = 0;
    for (let i = 0; i < this.SECOND_WEIGHTS_LENGTH; i++) {
      sum += parseInt(cpf.charAt(i)) * this.SECOND_WEIGHTS[i];
    }
    const remainder = sum % this.SUBTRACTION_VALUE;
    return remainder < this.REMAINDER_THRESHOLD ? 0 : this.SUBTRACTION_VALUE - remainder;
  }

  public static maskCPF(cpf: string): string {
    const cleanedCPF = this.cleanCPF(cpf);

    if (cleanedCPF.length !== this.CPF_LENGTH) {
      throw new Error("CPF deve ter 11 dígitos");
    }

    return this.applyMask(cleanedCPF);
  }

  private static applyMask(cpf: string): string {
    let maskedCPF = "";
    for (let i = 0; i < cpf.length; i++) {
      if (i === this.FIRST_DOT_POSITION || i === this.SECOND_DOT_POSITION) {
        maskedCPF += ".";
      } else if (i === this.HYPHEN_POSITION) {
        maskedCPF += "-";
      }
      maskedCPF += cpf.charAt(i);
    }
    return maskedCPF;
  }

  public static unmaskCPF(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  public static generateValidCPF(): string {
    const partialCPF = this.generateRandomDigits(this.PARTIAL_CPF_LENGTH);
    const firstDigit = this.calculateVerifierDigit(partialCPF, true);
    const secondDigit = this.calculateVerifierDigit(partialCPF + firstDigit, false);

    return partialCPF + firstDigit + secondDigit;
  }

  private static generateRandomDigits(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  private static calculateVerifierDigit(
    partialCPF: string,
    isFirstDigit: boolean
  ): number {
    const weights = isFirstDigit ? this.FIRST_WEIGHTS : this.SECOND_WEIGHTS;
    let sum = 0;

    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(partialCPF.charAt(i)) * weights[i];
    }

    const remainder = sum % this.SUBTRACTION_VALUE;
    return remainder < this.REMAINDER_THRESHOLD ? 0 : this.SUBTRACTION_VALUE - remainder;
  }

  public static isValidFormat(cpf: string): boolean {
    if (this.MASKED_FORMAT_PATTERN.test(cpf)) {
      return true;
    }

    if (this.UNMASKED_FORMAT_PATTERN.test(cpf)) {
      return true;
    }

    return this.PARTIAL_FORMAT_PATTERN.test(cpf);
  }
}
