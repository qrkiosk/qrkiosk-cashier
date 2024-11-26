import { AxiosError } from "axios";
import isEmpty from "lodash/isEmpty";

export const withErrorStatusCodeHandler =
  <TApi extends (...args: any[]) => Promise<any>>(
    api: TApi,
    handlers: Array<{ statusCode: number; handler: () => void }>,
  ) =>
  async (...args: Parameters<TApi>): Promise<Awaited<ReturnType<TApi>>> => {
    try {
      const res = await api(...args);
      return res;
    } catch (error) {
      const axiosError = error as AxiosError<Awaited<ReturnType<TApi>>>;

      if (!isEmpty(handlers)) {
        handlers
          .find((handler) => handler.statusCode === axiosError.status)
          ?.handler?.();
      }

      throw axiosError;
    }
  };
