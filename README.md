# Taio Merkle Verify

A Next.js application for calculating and verifying Merkle proofs with Redis storage.

## Overview

This project provides a set of APIs for:
- Calculating Merkle roots and proofs for user balances
- Storing proofs in Redis for efficient retrieval
- Verifying proofs against the Merkle root
- Managing epochs for data versioning

## Dependencies

### Core Dependencies
- `next`: ^15.3.3
- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `taio-merkle`: Local package for Merkle tree operations
- `ioredis`: ^5.6.1 - Redis client for data storage

### Development Dependencies
- `typescript`: ^5
- `eslint`: ^9
- `vitest`: ^3.2.3 - Testing framework
- `@types/*`: Type definitions for various packages

## API Endpoints

### 1. Calculate Merkle Root and Store Proofs
```http
POST /api/v1/merkle/root
```

**Request Body:**
```json
{
  "data": [
    "(1,1111)",
    "(2,2222)",
    "(3,3333)"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "root_id": "0x...",
    "epoch": 1234567890
  }
}
```

### 2. Get Current Epoch
```http
GET /api/v1/merkle/epoch
```

**Response:**
```json
{
  "success": true,
  "data": {
    "epoch": 1234567890
  }
}
```

### 3. Get User's Proof
```http
GET /api/v1/merkle/proof/{userId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "1",
    "balance": "1111",
    "proof": [["hash1", 0], ["hash2", 1]]
  }
}
```

### 4. Verify Merkle Proof
```http
POST /api/v1/merkle/verify
```

**Request Body:**
```json
{
  "userId": "1",
  "balance": "1111",
  "proof": [["hash1", 0], ["hash2", 1]]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "epoch": 1234567890
  }
}
```

## Redis Data Structure

The application uses the following Redis key patterns:

1. Current Epoch:
```
merkle:current:epoch -> timestamp
```

2. Merkle Root:
```
merkle:root:{epoch} -> root_hash
```

3. User Proof:
```
merkle:proof:{userId}:{epoch} -> { balance: string, proof: string[][] }
```

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```env
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_API_URL=http://localhost:3000
MERKLE_LEAF_TAG=ProofOfReserve_Leaf
MERKLE_BRANCH_TAG=ProofOfReserve_Branch
NEXT_PUBLIC_APP_ENV=staging
```

3. Run development server:
```bash
npm run dev
```

## Testing

Run tests using Vitest:
```bash
npm test
```

For UI testing:
```bash
npm run test:ui
```

For coverage report:
```bash
npm run test:coverage
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 404: Not Found (no epoch/proof found)
- 500: Server Error

All error responses include a detailed error message and additional context when available.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
