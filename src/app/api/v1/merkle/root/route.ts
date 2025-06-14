import { NextRequest, NextResponse } from 'next/server';
import { calculateMerkleRoot, calculateMerkleProofs } from 'taio-merkle';
import { RedisOperations } from '@/lib/redis/operations';
import { validateMerkleData, parseMerkleData } from '@/lib/validators/merkle';
import { CONFIG } from '@/config';

/**
 * @swagger
 * /api/v1/merkle/root:
 *   post:
 *     summary: Calculate Merkle root and store proofs
 *     description: |
 *       Calculates Merkle root for given data and stores proofs in Redis.
 *
 *       Example request:
 *       ```json
 *       {
 *         "data": [
 *           "(1,1111)",
 *           "(2,2222)",
 *           "(3,3333)",
 *           "(4,4444)",
 *           "(5,5555)",
 *           "(6,6666)",
 *           "(7,7777)",
 *           "(8,8888)"
 *         ]
 *       }
 *       ```
 *
 *       Example response:
 *       ```json
 *       {
 *         "success": true,
 *         "data": {
 *           "root_id": "0x...",
 *           "epoch": 1234567890
 *         }
 *       }
 *       ```
 *     tags: [Merkle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of data strings in format "(userId,balance)"
 *                 example: ["(1,1111)", "(2,2222)", "(3,3333)", "(4,4444)", "(5,5555)", "(6,6666)", "(7,7777)", "(8,8888)"]
 *     responses:
 *       200:
 *         description: Successfully calculated Merkle root
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
 *                     root_id:
 *                       type: string
 *                     epoch:
 *                       type: number
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'Data array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate data format and check for duplicates
    const validationResult = validateMerkleData(data);
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: validationResult.error,
          invalidItems: validationResult.invalidItems,
          duplicateUserIds: validationResult.duplicateUserIds
        },
        { status: 400 }
      );
    }

    // Generate epoch (current timestamp)
    const epoch = Math.floor(Date.now() / 1000);
    // await RedisOperations.setEpoch(epoch);

    // Calculate Merkle root
    const root = calculateMerkleRoot(
      data,
      CONFIG.merkle.leafTag,
      CONFIG.merkle.branchTag
    );

    // Store Merkle root
    await RedisOperations.setMerkleRoot(epoch, root);

    // Calculate and store Merkle proofs for each data item
    try {
      // Calculate all proofs at once
      const proofMap = calculateMerkleProofs(
        data,
        CONFIG.merkle.leafTag,
        CONFIG.merkle.branchTag
      );

      // Store proofs for each data item
      for (let i = 0; i < data.length; i++) {
        const { userId, balance } = parseMerkleData(data[i]);
        const proof = proofMap[i];

        // Store the proof in Redis
        await RedisOperations.setMerkleProof(epoch.toString(), userId, {
          balance,
          proof
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          root_id: root,
          epoch,
        },
      });
    } catch (error) {
      // Rollback epoch and root if proof storage fails
      await RedisOperations.del('merkle:current:epoch');
      await RedisOperations.del(`merkle:root:${epoch}`);

      console.error('Merkle proof calculation error:', error);
      return NextResponse.json(
        {
          error: 'Failed to calculate or store Merkle proofs',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Merkle root calculation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate Merkle root',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
