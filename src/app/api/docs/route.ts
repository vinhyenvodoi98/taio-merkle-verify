import { NextResponse } from 'next/server';
import { getSwaggerUiHtml } from '@/lib/swagger-ui';

export async function GET() {
  return new NextResponse(getSwaggerUiHtml(), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
