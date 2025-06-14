import { NextRequest, NextResponse } from 'next/server';
import { RedisOperations } from '@/lib/redis/operations';

/**
 * @swagger
 * /api/v1/merkle/proof/{userId}:
 *   get:
 *     summary: Get balance and merkle proof for a user
 *     description: Returns the balance and merkle proof for a specific user in the current epoch
 *     tags: [Merkle]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to get proof for
 *     responses:
 *       200:
 *         description: Proof retrieved successfully
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
 *                     userId:
 *                       type: string
 *                     balance:
 *                       type: string
 *                     proof:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *       404:
 *         description: No proof found for user
 *       500:
 *         description: Server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    // Get current epoch
    const epoch = await RedisOperations.getCurrentEpoch();
    if (!epoch) {
      return NextResponse.json(
        { error: 'No epoch found' },
        { status: 404 }
      );
    }

    // Get proof for user
    const proof = await RedisOperations.getMerkleProof(epoch.toString(), userId);
    if (!proof) {
      return NextResponse.json(
        { error: `No proof found for user ${userId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        ...proof
      }
    });
  } catch (error) {
    console.error('Failed to get proof:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get proof',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 