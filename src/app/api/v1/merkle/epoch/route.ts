import { NextResponse } from 'next/server';
import { RedisOperations } from '@/lib/redis/operations';

/**
 * @swagger
 * /api/v1/merkle/epoch:
 *   get:
 *     summary: Get current epoch
 *     description: Returns the current epoch timestamp
 *     tags: [Merkle]
 *     responses:
 *       200:
 *         description: Current epoch retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     epoch:
 *                       type: number
 *       404:
 *         description: No epoch found
 *       500:
 *         description: Server error
 */
export async function GET() {
  try {
    const epoch = await RedisOperations.getCurrentEpoch();
    
    if (!epoch) {
      return NextResponse.json(
        { error: 'No epoch found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { epoch }
    });
  } catch (error) {
    console.error('Failed to get epoch:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get epoch',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 