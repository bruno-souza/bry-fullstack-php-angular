import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor global para tratamento de erros HTTP
 * Captura e formata erros de forma genérica para todos os serviços
 */
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente (rede, etc)
        errorMessage = `Erro no cliente: ${error.error.message}`;
      } else {
        // Erro do lado do servidor
        switch (error.status) {
          case 0:
            errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e se o backend está rodando.';
            break;
          case 400:
            errorMessage = error.error.message || 'Requisição inválida.';
            break;
          case 401:
            errorMessage = 'Não autorizado. Faça login para continuar.';
            break;
          case 403:
            errorMessage = 'Acesso negado. Você não tem permissão para acessar este recurso.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado. Verifique se o registro existe.';
            break;
          case 422:
            // Erros de validação do Laravel
            errorMessage = 'Erro de validação:\n';
            if (error.error.errors) {
              const errors = Object.entries(error.error.errors).map(([field, messages]) => {
                return `• ${field}: ${(messages as string[]).join(', ')}`;
              });
              errorMessage += errors.join('\n');
            } else {
              errorMessage += error.error.message || 'Dados inválidos fornecidos.';
            }
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde ou contate o suporte.';
            break;
          case 503:
            errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
            break;
          default:
            errorMessage = error.error.message || `Erro ${error.status}: ${error.statusText}`;
        }
      }

      // Log detalhado no console para debug
      console.error('========== ERRO HTTP ==========');
      console.error('URL:', req.url);
      console.error('Método:', req.method);
      console.error('Status:', error.status);
      console.error('Mensagem:', errorMessage);
      console.error('Detalhes:', error);
      console.error('===============================');

      // Exibe mensagem para o usuário
      alert(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
