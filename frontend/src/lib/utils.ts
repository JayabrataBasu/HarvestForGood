/**
 * Debounce function to delay execution of a function.
 * @param func The function to debounce.
 * @param waitFor The delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<F extends (...args: unknown[]) => unknown>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args) as ReturnType<F>), waitFor);
    });
}
