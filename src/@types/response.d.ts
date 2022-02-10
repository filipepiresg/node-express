/**
 * Modelo de resposta de erro
 */
export interface ErrorResponse {
  /**
   * Mensagem de erro
   */
  message: string;
  /**
   * Caso haja algum detalhe do erro, será enviado como string ou como um objeto
   */
  details?: string | any;
}
