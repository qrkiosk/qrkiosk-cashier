import { AxiosError } from "axios";
import isEmpty from "lodash/isEmpty";

export const withErrorStatusCodeHandler =
  <T extends (...args: any[]) => Promise<any>>(
    api: T,
    handlers: Array<{ statusCode: number; handler: () => void }>,
  ) =>
  async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      const res = await api(...args);
      return res;
    } catch (error) {
      const axiosError = error as AxiosError<Awaited<ReturnType<T>>>;

      if (!isEmpty(handlers)) {
        handlers
          .find((handler) => handler.statusCode === axiosError.status)
          ?.handler?.();
      }

      throw axiosError;
    }
  };
