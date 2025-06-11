export default function Home() {
  return (
    <main>
      <h1>API Service</h1>
      <p>This is an API-focused Next.js application.</p>
      <p>Available endpoints:</p>
      <ul>
        <li>POST /api/v1/merkle/root - Creates a new Merkle tree and returns its root ID</li>
      </ul>
      <p>
        <a href="/api-docs">View API Documentation</a>
      </p>
    </main>
  )
}
