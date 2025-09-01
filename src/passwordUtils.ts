interface PasswordConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  preventSequential: boolean;
  preventRepeating: boolean;
}

export function validatePassword(password: string): boolean {
  if (!password) {
    return false;
  }

  const config: PasswordConfig = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventSequential: true,
    preventRepeating: true,
  };

  const violations: string[] = [];

  violations.push(...validateLength(password, config));
  violations.push(...validateCharacterTypes(password, config));
  violations.push(...validateSequentialPatterns(password, config));
  violations.push(...validateRepeatingCharacters(password, config));

  return violations.length === 0;
}

function validateLength(password: string, config: PasswordConfig): string[] {
  const violations: string[] = [];

  if (password.length < config.minLength) {
    violations.push(`Senha deve ter pelo menos ${config.minLength} caracteres`);
  }

  if (config.maxLength && password.length > config.maxLength) {
    violations.push(`Senha deve ter no máximo ${config.maxLength} caracteres`);
  }

  return violations;
}

function validateCharacterTypes(password: string, config: PasswordConfig): string[] {
  const violations: string[] = [];

  violations.push(...validateUppercase(password, config));
  violations.push(...validateLowercase(password, config));
  violations.push(...validateNumbers(password, config));
  violations.push(...validateSymbols(password, config));

  return violations;
}

function validateUppercase(password: string, config: PasswordConfig): string[] {
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    return ["Senha deve conter pelo menos uma letra maiúscula"];
  }
  return [];
}

function validateLowercase(password: string, config: PasswordConfig): string[] {
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    return ["Senha deve conter pelo menos uma letra minúscula"];
  }
  return [];
}

function validateNumbers(password: string, config: PasswordConfig): string[] {
  if (config.requireNumbers && !/\d/.test(password)) {
    return ["Senha deve conter pelo menos um número"];
  }
  return [];
}

function validateSymbols(password: string, config: PasswordConfig): string[] {
  if (
    config.requireSymbols &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    return ["Senha deve conter pelo menos um caractere especial"];
  }
  return [];
}

function validateSequentialPatterns(password: string, config: PasswordConfig): string[] {
  const violations: string[] = [];

  if (config.preventSequential) {
    const sequentialPatterns = [/123/, /abc/, /qwe/, /asd/, /zxc/];

    for (const pattern of sequentialPatterns) {
      if (pattern.test(password.toLowerCase())) {
        violations.push("Senha não deve conter sequências");
        break;
      }
    }
  }

  return violations;
}

function validateRepeatingCharacters(password: string, config: PasswordConfig): string[] {
  const violations: string[] = [];

  if (config.preventRepeating) {
    if (/(.)\1{2,}/.test(password)) {
      violations.push("Senha não deve ter caracteres repetidos em excesso");
    }
  }

  return violations;
}
