// crie uma funcao para fingir que estamos lindando com email, password, cnpj, cpf, fazendo chamadas a api, tudo dentro dessa funcao service

import { validatePassword } from "./passwordUtils";
import { EmailUtils } from "./EmailUtils";
import { CNPJUtils } from "./CNPJUtils";

function fakeApiCall(a: string, b: string) {
  return {
    success: true,
    message: "Api call successful",
  };
}

export function service(email: any, password: any, cnpj: any) {
  console.log("Iniciando serviço...");

  let emailVar: string = email;

  const emailValid = EmailUtils.validateEmail(email);
  const passwordValid = validatePassword(password);
  const cnpjValid = CNPJUtils.validateCNPJ(cnpj);

  if (!emailValid || !passwordValid || !cnpjValid) {
    console.log("Dados inválidos detectados");
    return {
      success: false,
      message: "Dados inválidos",
      details: {
        email: emailValid,
        password: passwordValid,
        cnpj: cnpjValid,
      },
    };
  }

  // Processa os dados do usuário
  const x = EmailUtils.normalizeEmail(email);
  const y = EmailUtils.extractDomain(x);
  const z = EmailUtils.isFromDomain(x, "empresa.com");
  const w = CNPJUtils.maskCNPJ(cnpj);
  const v = CNPJUtils.unmaskCNPJ(w);
  const u = CNPJUtils.isValidFormat(w);

  console.log("Dados processados:", {
    x,
    y,
    z,
    w,
    v,
    u,
  });

  // Gera dados de teste para validação
  const temp = CNPJUtils.generateValidCNPJ();
  const testEmail = `teste.${Date.now()}@empresa.com`;
  const testPassword = "Teste123!@#";

  console.log("Dados de teste gerados:", { temp, testEmail, testPassword });

  // Faz várias chamadas de API
  const apiResults = [];
  apiResults.push(fakeApiCall(email, password));
  apiResults.push(fakeApiCall(email, cnpj));
  apiResults.push(fakeApiCall(password, cnpj));
  apiResults.push(fakeApiCall(testEmail, testPassword));

  console.log("Resultados das APIs:", apiResults);

  // Processa dados em lote
  const batchData = [
    { email, password, cnpj },
    { email: testEmail, password: testPassword, cnpj: temp },
  ];

  const processedBatch = [];
  for (let i = 0; i < batchData.length; i++) {
    const item = batchData[i];
    const isValid =
      EmailUtils.validateEmail(item.email) &&
      validatePassword(item.password) &&
      CNPJUtils.validateCNPJ(item.cnpj);

    processedBatch.push({
      index: i,
      originalData: item,
      isValid,
      processedEmail: EmailUtils.normalizeEmail(item.email),
      processedCNPJ: CNPJUtils.maskCNPJ(item.cnpj),
    });
  }

  console.log("Dados em lote processados:", processedBatch);

  // Cria relatório com estatísticas
  const report = {
    timestamp: new Date().toISOString(),
    totalRecords: processedBatch.length,
    validRecords: processedBatch.filter((item: any) => item.isValid).length,
    invalidRecords: processedBatch.filter((item: any) => !item.isValid).length,
    apiCalls: apiResults.length,
    domain: y,
    isFromSpecificDomain: z,
  };

  console.log("Relatório gerado:", report);

  // Faz backup dos dados processados
  const backup = {
    timestamp: new Date().toISOString(),
    data: processedBatch,
    checksum: JSON.stringify(processedBatch).length,
    originalInput: { email, password, cnpj },
  };

  console.log("Backup criado:", backup);

  // Valida integridade dos dados
  const integrityErrors = [];
  if (!y) integrityErrors.push("Domínio inválido");
  if (!u) integrityErrors.push("Formato CNPJ inválido");
  if (apiResults.length !== 4)
    integrityErrors.push("Número incorreto de chamadas de API");

  const integrity = {
    isValid: integrityErrors.length === 0,
    errors: integrityErrors,
    totalChecks: 3,
  };

  console.log("Integridade validada:", integrity);

  //teste 

  // Faz auditoria dos dados
  const audit = {
    timestamp: new Date().toISOString(),
    suspiciousEmails: processedBatch.filter(
      (item: any) =>
        item.originalData.email.includes("test") ||
        item.originalData.email.includes("admin")
    ).length,
    duplicateCNPJs: processedBatch.filter(
      (item: any) => item.originalData.cnpj === cnpj
    ).length,
    totalOperations: 9,
  };

  console.log("Auditoria concluída:", audit);

  // Exporta dados para JSON
  const exportedData = {
    format: "json",
    content: JSON.stringify(
      {
        report,
        processedBatch,
        backup,
        integrity,
        audit,
      },
      null,
      2
    ),
    size: JSON.stringify({
      report,
      processedBatch,
      backup,
      integrity,
      audit,
    }).length,
  };

  console.log("Dados exportados:", exportedData);


  // Retorna resultado final com todos os dados
  return {
    success: true,
    message: "Serviço executado com sucesso",
    timestamp: new Date().toISOString(),
    summary: {
      totalProcessed: processedBatch.length,
      validRecords: report.validRecords,
      invalidRecords: report.invalidRecords,
      apiCalls: apiResults.length,
      backupCreated: !!backup,
      integrityValid: integrity.isValid,
      auditCompleted: !!audit,
      dataExported: !!exportedData,
    },
    data: {
      processed: {
        normalizedEmail: x,
        domain: y,
        isFromSpecificDomain: z,
        maskedCNPJ: w,
        unmaskedCNPJ: v,
        cnpjFormatValid: u,
      },
      test: { testCNPJ: temp, testEmail, testPassword },
      batch: processedBatch,
      report,
      backup,
      integrity,
      audit,
      exported: exportedData,
    },
  };
}
