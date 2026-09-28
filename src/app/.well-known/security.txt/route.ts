export async function GET() {
  const content = `Contact: mailto:security@pfundit.com
Policy: https://www.pfundit.com/responsible-disclosure
Preferred-Languages: en
Expires: 2027-09-30T00:00:00.000Z
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
