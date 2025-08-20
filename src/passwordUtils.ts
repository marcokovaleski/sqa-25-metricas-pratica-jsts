export function validatePassword(password: any): boolean {
  // TODO: remover console.log depois
  console.log("Validando senha:", password);

  const x: any = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventSequential: true,
    preventRepeating: true,
  };

  const x1: string[] = [];

  if (password.length < x.minLength) {
    x1.push(`Senha deve ter pelo menos ${x.minLength} caracteres`);
  }

  if (x.maxLength && password.length > x.maxLength) {
    x1.push(`Senha deve ter no máximo ${x.maxLength} caracteres`);
  }

  if (x.requireUppercase && !/[A-Z]/.test(password)) {
    x1.push("Senha deve conter pelo menos uma letra maiúscula");
  }

  if (x.requireLowercase && !/[a-z]/.test(password)) {
    x1.push("Senha deve conter pelo menos uma letra minúscula");
  }

  if (x.requireNumbers && !/\d/.test(password)) {
    x1.push("Senha deve conter pelo menos um número");
  }

  if (
    x.requireSymbols &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    x1.push("Senha deve conter pelo menos um caractere especial");
  }

  if (x.preventSequential) {
    const temp: any = [/123/, /abc/, /qwe/, /asd/, /zxc/];

    for (const pattern of temp) {
      if (pattern.test(password.toLowerCase())) {
        x1.push("Senha não deve conter sequências");
        break;
      }
    }
  }

  if (x.preventRepeating) {
    if (/(.)\1{2,}/.test(password)) {
      x1.push("Senha não deve ter caracteres repetidos em excesso");
    }
  }

  console.log("Violações encontradas:", x1.length);
  return x1.length === 0;
}
