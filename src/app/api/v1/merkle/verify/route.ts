import { NextRequest, NextResponse } from 'next/server';
import { RedisOperations } from '@/lib/redis/operations';
import { verifyMerkleProof } from 'taio-merkle';
import { CONFIG } from '@/config';

/**
 * @swagger
 * /api/v1/merkle/verify:
 *   post:
 *     summary: Verify a Merkle proof
 *     description: Verifies if a given proof is valid for a user's balance
 *     tags: [Merkle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - balance
 *               - proof
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to verify
 *               balance:
 *                 type: string
 *                 description: User's balance to verify
 *               proof:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: string
 *                 description: Merkle proof to verify
 *     responses:
 *       200:
 *         description: Verification result
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
 *                     isValid:
 *                       type: boolean
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: No epoch or root found
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, balance, proof } = body;

    // Validate required fields
    if (!userId || !balance || !proof) {
      return NextResponse.json(
        { error: 'userId, balance, and proof are required' },
        { status: 400 }
      );
    }

    // Get current epoch
    const epoch = await RedisOperations.getCurrentEpoch();
    if (!epoch) {
      return NextResponse.json(
        { error: 'No epoch found' },
        { status: 404 }
      );
    }

    // Get Merkle root for current epoch
    const root = await RedisOperations.getMerkleRoot(epoch);
    if (!root) {
      return NextResponse.json(
        { error: 'No Merkle root found for current epoch' },
        { status: 404 }
      );
    }

    // Format the leaf data as "(userId,balance)"
    const leaf = `(${userId},${balance})`;

    // Verify the proof
    const isValid = verifyMerkleProof(
      leaf,
      proof,
      root,
      CONFIG.merkle.leafTag,
      CONFIG.merkle.branchTag
    );

    return NextResponse.json({
      success: true,
      data: {
        isValid,
        epoch
      }
    });
  } catch (error) {
    console.error('Failed to verify proof:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify proof',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
