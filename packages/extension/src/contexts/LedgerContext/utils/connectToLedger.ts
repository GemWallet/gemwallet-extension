import { Client } from 'xrpl';

export const connectToLedger = async (server: string): Promise<Client> => {
  let client = new Client(server);
  try {
    await client.connect();
  } catch (e) {
    throw new Error(`Could not connect to ${server}: ${JSON.stringify(e)}`);
  }
  return client;
};
