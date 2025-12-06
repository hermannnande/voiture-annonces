import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 90,
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
    // ImageResponse options
    {
      ...size,
    }
  );
}

