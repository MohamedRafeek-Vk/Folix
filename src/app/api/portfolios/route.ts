import { NextRequest, NextResponse } from 'next/server';
import { saveServerPortfolio, getAllServerPortfolios, sanitizeSlug } from '../../../utils/serverStorage';
import { PortfolioData } from '../../../types/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await getAllServerPortfolios();
    return NextResponse.json({ success: true, count: list.length, portfolios: list });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to list portfolios' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PortfolioData;
    let cleanSlug = body?.slug ? sanitizeSlug(body.slug) : sanitizeSlug(body?.name || 'portfolio');
    if (!cleanSlug || cleanSlug === 'portfolio') {
      cleanSlug = `portfolio-${Date.now().toString(36)}`;
    }

    const result = await saveServerPortfolio({
      ...body,
      slug: cleanSlug
    });
    return NextResponse.json({
      success: true,
      slug: result.slug,
      id: result.id,
      overwritten: result.overwritten
    });
  } catch (err: any) {
    console.error('Error saving portfolio:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save portfolio' },
      { status: 500 }
    );
  }
}
