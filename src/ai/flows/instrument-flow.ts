
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
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a random success/failure for demonstration
    const isSuccess = Math.random() > 0.3; // 70% chance of success

    if (isSuccess) {
      return {
        success: true,
        message: `Successfully connected to instrument at ${ip}:${port}.`,
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to ${ip}:${port}. Check network and instrument status.`,
      };
    }
  }
);


export async function testConnection(
  input: ConnectionTestInput
): Promise<ConnectionTestOutput> {
  return testConnectionFlow(input);
}
