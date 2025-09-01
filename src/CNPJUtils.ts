export class CNPJUtils {
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
  private static readonly VALUE_12 = this.VALUE_10 + this.VALUE_2;
  private static readonly VALUE_13 = this.VALUE_10 + this.VALUE_3;
  private static readonly VALUE_14 = this.VALUE_10 + this.VALUE_4;

  //CNPJ specific constants
  private static readonly CNPJ_LENGTH = this.VALUE_14;
  private static readonly PARTIAL_CNPJ_LENGTH = this.VALUE_12;
  private static readonly FIRST_DIGIT_INDEX = this.VALUE_12;
  private static readonly SECOND_DIGIT_INDEX = this.VALUE_13;

  //Algorithm constants
  private static readonly REMAINDER_THRESHOLD = this.VALUE_2;
  private static readonly SUBTRACTION_VALUE = this.VALUE_11;
  private static readonly FIRST_WEIGHTS_LENGTH = this.VALUE_12;
  private static readonly SECOND_WEIGHTS_LENGTH = this.VALUE_13;

  //Position constants
  private static readonly POSITION_2 = this.VALUE_2;
  private static readonly POSITION_5 = this.VALUE_5;
  private static readonly POSITION_8 = this.VALUE_8;
  private static readonly POSITION_12 = this.VALUE_12;
  private static readonly POSITION_13 = this.VALUE_13;

  //Weight values for digit calculation
  private static readonly WEIGHT_5 = this.VALUE_5;
  private static readonly WEIGHT_4 = this.VALUE_4;
  private static readonly WEIGHT_3 = this.VALUE_3;
  private static readonly WEIGHT_2 = this.VALUE_2;
  private static readonly WEIGHT_9 = this.VALUE_9;
  private static readonly WEIGHT_8 = this.VALUE_8;
  private static readonly WEIGHT_7 = this.VALUE_7;
  private static readonly WEIGHT_6 = this.VALUE_6;

  //Weight arrays for digit calculation
  private static readonly FIRST_WEIGHTS = [
    this.WEIGHT_5, this.WEIGHT_4, this.WEIGHT_3, this.WEIGHT_2,
    this.WEIGHT_9, this.WEIGHT_8, this.WEIGHT_7, this.WEIGHT_6,
    this.WEIGHT_5, this.WEIGHT_4, this.WEIGHT_3, this.WEIGHT_2
  ];
  private static readonly SECOND_WEIGHTS = [
    this.WEIGHT_6, this.WEIGHT_5, this.WEIGHT_4, this.WEIGHT_3,
    this.WEIGHT_2, this.WEIGHT_9, this.WEIGHT_8, this.WEIGHT_7,
    this.WEIGHT_6, this.WEIGHT_5, this.WEIGHT_4, this.WEIGHT_3,
    this.WEIGHT_2
  ];

  //Mask positions
  private static readonly FIRST_DOT_POSITION = this.POSITION_2;
  private static readonly SECOND_DOT_POSITION = this.POSITION_5;
  private static readonly SLASH_POSITION = this.POSITION_8;
  private static readonly HYPHEN_POSITION = this.POSITION_12;

  //Regex patterns
  private static readonly ALL_SAME_DIGITS_PATTERN = /^(\d)\1{13}$/;
  private static readonly MASKED_FORMAT_PATTERN = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  private static readonly UNMASKED_FORMAT_PATTERN = /^\d{14}$/;
  private static readonly PARTIAL_FORMAT_PATTERN = /^\d{0,2}(\.\d{0,3})?(\.\d{0,3})?(\/\d{0,4})?(-\d{0,2})?$/;

  public static validateCNPJ(cnpj: string): boolean {
    const cleanedCNPJ = this.cleanCNPJ(cnpj);

    if (cleanedCNPJ.length !== this.CNPJ_LENGTH) {
      return false;
    }

    if (this.hasAllSameDigits(cleanedCNPJ)) {
      return false;
    }

    const firstDigit = this.calculateFirstDigit(cleanedCNPJ);
    const secondDigit = this.calculateSecondDigit(cleanedCNPJ);

    return (
      parseInt(cleanedCNPJ.charAt(this.FIRST_DIGIT_INDEX)) === firstDigit &&
      parseInt(cleanedCNPJ.charAt(this.SECOND_DIGIT_INDEX)) === secondDigit
    );
  }

  private static cleanCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, "");
  }

  private static hasAllSameDigits(cnpj: string): boolean {
    return this.ALL_SAME_DIGITS_PATTERN.test(cnpj);
  }

  private static calculateFirstDigit(cnpj: string): number {
    let sum = 0;
    for (let i = 0; i < this.FIRST_WEIGHTS_LENGTH; i++) {
      sum += parseInt(cnpj.charAt(i)) * this.FIRST_WEIGHTS[i];
    }

    const remainder = sum % this.SUBTRACTION_VALUE;
    return remainder < this.REMAINDER_THRESHOLD ? 0 : this.SUBTRACTION_VALUE - remainder;
  }

  private static calculateSecondDigit(cnpj: string): number {
    let sum = 0;
    for (let i = 0; i < this.SECOND_WEIGHTS_LENGTH; i++) {
      sum += parseInt(cnpj.charAt(i)) * this.SECOND_WEIGHTS[i];
    }

    const remainder = sum % this.SUBTRACTION_VALUE;
    return remainder < this.REMAINDER_THRESHOLD ? 0 : this.SUBTRACTION_VALUE - remainder;
  }

  public static maskCNPJ(cnpj: string): string {
    const cleanedCNPJ = this.cleanCNPJ(cnpj);

    if (cleanedCNPJ.length !== this.CNPJ_LENGTH) {
      throw new Error("CNPJ deve ter 14 dígitos");
    }

    return this.applyMask(cleanedCNPJ);
  }

  private static applyMask(cnpj: string): string {
    let maskedCNPJ = "";
    for (let i = 0; i < cnpj.length; i++) {
      if (i === this.FIRST_DOT_POSITION || i === this.SECOND_DOT_POSITION) {
        maskedCNPJ += ".";
      } else if (i === this.SLASH_POSITION) {
        maskedCNPJ += "/";
      } else if (i === this.HYPHEN_POSITION) {
        maskedCNPJ += "-";
      }
      maskedCNPJ += cnpj.charAt(i);
    }
    return maskedCNPJ;
  }

  public static unmaskCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, "");
  }

  public static generateValidCNPJ(): string {
    const partialCNPJ = this.generateRandomDigits(this.PARTIAL_CNPJ_LENGTH);
    const firstDigit = this.calculateVerifierDigit(partialCNPJ, true);
    const secondDigit = this.calculateVerifierDigit(partialCNPJ + firstDigit, false);

    return partialCNPJ + firstDigit + secondDigit;
  }

  private static generateRandomDigits(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  private static calculateVerifierDigit(
    partialCNPJ: string,
    isFirstDigit: boolean
  ): number {
    const weights = isFirstDigit ? this.FIRST_WEIGHTS : this.SECOND_WEIGHTS;
    let sum = 0;

    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(partialCNPJ.charAt(i)) * weights[i];
    }

    const remainder = sum % this.SUBTRACTION_VALUE;
    return remainder < this.REMAINDER_THRESHOLD ? 0 : this.SUBTRACTION_VALUE - remainder;
  }

  public static isValidFormat(cnpj: string): boolean {
    if (this.MASKED_FORMAT_PATTERN.test(cnpj)) {
      return true;
    }

    if (this.UNMASKED_FORMAT_PATTERN.test(cnpj)) {
      return true;
    }

    return this.PARTIAL_FORMAT_PATTERN.test(cnpj);
  }
}
