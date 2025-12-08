import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 95,
          background: '#1e3a8a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          borderRadius: '32px',
        }}
      >
        <span style={{ color: 'white' }}>A</span>
        <span style={{ color: '#f97316' }}>A</span>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}

