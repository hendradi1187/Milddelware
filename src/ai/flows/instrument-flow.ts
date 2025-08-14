
'use server';
/**
 * @fileOverview A flow to simulate instrument connection tests.
 *
 * - testConnection - A function that simulates a backend connection test.
 * - ConnectionTestInput - The input type for the testConnection function.
 * - ConnectionTestOutput - The return type for the testConnection function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as net from 'net';

const ConnectionTestInputSchema = z.object({
  ip: z.string().ip({ message: "Invalid IP address" }),
  port: z.string().refine(val => {
    const portNum = parseInt(val, 10);
    return !isNaN(portNum) && portNum > 0 && portNum < 65536;
  }, { message: "Invalid port number" }),
});
export type ConnectionTestInput = z.infer<typeof ConnectionTestInputSchema>;

const ConnectionTestOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ConnectionTestOutput = z.infer<typeof ConnectionTestOutputSchema>;


const testConnectionFlow = ai.defineFlow(
  {
    name: 'testConnectionFlow',
    inputSchema: ConnectionTestInputSchema,
    outputSchema: ConnectionTestOutputSchema,
  },
  async ({ ip, port }) => {
    const portNum = parseInt(port, 10);

    return new Promise((resolve) => {
      const socket = new net.Socket();
      const timeout = 2000; // 2 seconds timeout

      const timer = setTimeout(() => {
        socket.destroy();
        resolve({
          success: false,
          message: `Connection to ${ip}:${portNum} timed out after ${timeout / 1000} seconds.`,
        });
      }, timeout);

      socket.on('connect', () => {
        clearTimeout(timer);
        socket.end();
        resolve({
          success: true,
          message: `Successfully connected to instrument at ${ip}:${portNum}.`,
        });
      });

      socket.on('error', (err) => {
        clearTimeout(timer);
        socket.destroy();
        resolve({
          success: false,
          message: `Failed to connect to ${ip}:${portNum}. Error: ${err.message}`,
        });
      });
      
      // Since this runs in a serverless environment, connecting to 'localhost' 
      // refers to the server's localhost, not the user's. 
      // For local testing with tools like Hercules, the app and the tool 
      // must be on the same machine, and you should use the machine's local network IP
      // or 127.0.0.1 if running the app locally with `npm run dev`.
      socket.connect(portNum, ip);
    });
  }
);


export async function testConnection(
  input: ConnectionTest.ConnectionTestInput
): Promise<ConnectionTest.ConnectionTestOutput> {
  return testConnectionFlow(input);
}

// Declaring the namespace for clarity when using these types in other files.
export namespace ConnectionTest {
  export type ConnectionTestInput = z.infer<typeof ConnectionTestInputSchema>;
  export type ConnectionTestOutput = z.infer<typeof ConnectionTestOutputSchema>;
}
