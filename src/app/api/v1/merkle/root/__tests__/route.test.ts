import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { calculateMerkleRoot } from 'taio-merkle';
import { MERKLE_CONFIG } from '@/config';

// Mock the taio-merkle module
vi.mock('taio-merkle', () => ({
  calculateMerkleRoot: vi.fn()
}));

describe('POST /api/v1/merkle/root', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if data array is empty', async () => {
    const request = new NextRequest('http://localhost:3000/api/v1/merkle/root', {
      method: 'POST',
      body: JSON.stringify({
        data: []
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Data array cannot be empty');
  });

  it('should return 400 if data format is invalid', async () => {
    const request = new NextRequest('http://localhost:3000/api/v1/merkle/root', {
      method: 'POST',
      body: JSON.stringify({
        data: ['(10,100)', 'invalid', '(30,300)']
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid data format. Expected format: (userId,balance)');
    expect(data.invalidItems).toContain('invalid');
  });

  it('should return 400 if balance is negative', async () => {
    const request = new NextRequest('http://localhost:3000/api/v1/merkle/root', {
      method: 'POST',
      body: JSON.stringify({
        data: ['(10,-100)']
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid data format. Expected format: (userId,balance)');
    expect(data.invalidItems).toContain('(10,-100)');
  });

  it('should return 400 if balance is not an integer', async () => {
    const request = new NextRequest('http://localhost:3000/api/v1/merkle/root', {
      method: 'POST',
      body: JSON.stringify({
        data: ['(10,100.5)']
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid data format. Expected format: (userId,balance)');
    expect(data.invalidItems).toContain('(10,100.5)');
  });

  it('should return 200 with root_id for valid request', async () => {
    const mockRootId = '0x1234...';
    vi.mocked(calculateMerkleRoot).mockReturnValue(mockRootId);

    const request = new NextRequest('http://localhost:3000/api/v1/merkle/root', {
      method: 'POST',
      body: JSON.stringify({
        data: ['(10,100)', '(20,200)', '(30,300)']
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.root_id).toBe(mockRootId);
    expect(calculateMerkleRoot).toHaveBeenCalledWith(
      ['(10,100)', '(20,200)', '(30,300)'],
      MERKLE_CONFIG.LEAF_TAG,
      MERKLE_CONFIG.BRANCH_TAG
    );
  });

  it('should return 500 if calculateMerkleRoot throws an error', async () => {
    vi.mocked(calculateMerkleRoot).mockImplementation(() => {
      throw new Error('Calculation failed');
    });

    const request = new NextRequest('http://localhost:3000/api/v1/merkle/root', {
      method: 'POST',
      body: JSON.stringify({
        data: ['(10,100)']
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate Merkle root');
  });
}); 