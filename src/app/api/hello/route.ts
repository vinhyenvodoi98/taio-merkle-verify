import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a hello message
 *     description: A simple endpoint that returns a greeting message
 *     responses:
 *       200:
 *         description: A hello message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello from the API!
 */
export async function GET() {
  return NextResponse.json({ message: 'Hello from the API!' })
}

/**
 * @swagger
 * /api/hello:
 *   post:
 *     summary: Accepts and returns JSON data
 *     description: An endpoint that accepts JSON data and returns it back
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 example: "test data"
 *     responses:
 *       200:
 *         description: The received data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data received
 *                 data:
 *                   type: object
 */
export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ 
    message: 'Data received',
    data: body
  })
}
