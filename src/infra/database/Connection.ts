export interface Connection {
  query: (statement: string, params: any, callback: Function) => Promise<any>
  close: () => Promise<void>;
}
