export const useFormatters = () => {
  /**
   * Formata CPF no padrão 000.000.000-00
   */
  const formatCPF = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 11); // <-- aqui
    return digitsOnly
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  /**
   * Formata telefone no padrão (00) 00000-0000
   */
  const formatTelefone = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  /**
   * Formata agência no padrão 0000-0
   */
  const formatAgencia = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 6);
  };

  /**
   * Formata número da conta no padrão 00000-0
   */
  const formatConta = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 7);
  };

  /**
   * Remove qualquer formatação (deixar só números)
   */
  const unformat = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  /**
   * Permite apenas números em um evento de teclado
   * @param e Evento de teclado
   */
  const permitirSomenteNumeros = (e: KeyboardEvent) => {
    const isNumero = /^\d$/.test(e.key);
    if (!isNumero) {
      e.preventDefault();
    }
  };

  return {
    formatCPF,
    formatTelefone,
    formatAgencia,
    formatConta,
    unformat,
    permitirSomenteNumeros,
  };
};
