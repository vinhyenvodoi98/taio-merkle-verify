import { NextRequest, NextResponse } from 'next/server';
import { calculateMerkleRoot } from 'taio-merkle';
import { validateMerkleData } from '@/lib/validators/merkle';
import { CONFIG } from '@/config';

/**
 * @swagger
 * /api/v1/merkle/root:
 *   post:
 *     summary: Calculate Merkle root from data array
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
 *                 description: Array of data strings in format (userId,balance)
 *     responses:
 *       200:
 *         description: Merkle root calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 root_id:
 *                   type: string
 *                   description: The calculated Merkle root
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'Data array cannot be empty' },
        { status: 400 }
      );
    }

    const validationResult = validateMerkleData(data);
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid data format. Expected format: (userId,balance)',
          invalidItems: validationResult.invalidItems,
        },
        { status: 400 }
      );
    }

    const rootId = calculateMerkleRoot(
      data,
      CONFIG.merkle.leafTag,
      CONFIG.merkle.branchTag
    );

    return NextResponse.json({ root_id: rootId });
  } catch (error) {
    console.error('Error generating Merkle root:', error);
    return NextResponse.json(
      { error: 'Failed to generate Merkle root' },
      { status: 500 }
    );
  }
}
