import { NextRequest, NextResponse } from 'next/server';
import { getServerPortfolio, deleteServerPortfolio } from '../../../../utils/serverStorage';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Check query params if an ID was passed e.g. /api/portfolios/alex?id=...
    const url = new URL(req.url);
    const idParam = url.searchParams.get('id');

    let portfolio = await getServerPortfolio(slug);
    if (!portfolio && idParam) {
      portfolio = await getServerPortfolio(idParam);
    }

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolio, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (err: any) {
    console.error('Error fetching portfolio:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteServerPortfolio(slug);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
}

