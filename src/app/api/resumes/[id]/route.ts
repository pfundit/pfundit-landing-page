import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const { getDatabase } = await import('@/lib/db/client');
    const { GridFSBucket } = await import('mongodb');

    const db = await getDatabase();
    const bucket = new GridFSBucket(db, { bucketName: 'resumes' });

    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(objectId);

    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': (file.metadata?.contentType as string) || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving resume:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
