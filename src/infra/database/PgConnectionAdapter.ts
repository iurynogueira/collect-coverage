import { Connection } from "./Connection";
const { Client } = require('pg');

export class PgConnectionAdapter implements Connection {
  pgClient: any;

  constructor(){
    this.pgClient = new Client({
      user: Bun.env.DB_USER,
      host: Bun.env.DB_HOST,
      database: Bun.env.DB_DB,
      password: Bun.env.DB_PASS,
      port: 5432,
    });

    this.pgClient.connect();
  }
  close(): Promise<void>{
    return this.pgClient.end();
  };

  async query(sql: string, values?: any[]): Promise<any> {
    try {
      return await this.pgClient.query(sql, values);
    } catch (error) {
      throw error;
    } finally {
      this.close();
    }
  }
}