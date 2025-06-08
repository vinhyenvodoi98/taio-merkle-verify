export default function Home() {
  return (
    <main>
      <h1>API Service</h1>
      <p>This is an API-focused Next.js application.</p>
      <p>Available endpoints:</p>
      <ul>
        <li>GET /api/hello - Returns a hello message</li>
        <li>POST /api/hello - Accepts JSON data and returns it back</li>
      </ul>
      <p>
        <a href="/api/docs">View API Documentation</a>
      </p>
    </main>
  )
}
