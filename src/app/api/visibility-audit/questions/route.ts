import { NextResponse } from 'next/server';

import { generateQuestions } from '@/lib/visibility-audit/question-generation';
import { defaultForm, type IntakeForm, type Locale } from '@/lib/visibility-audit/shared';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: Locale; form?: Partial<IntakeForm> };
    const locale = body.locale === 'en' ? 'en' : 'zh';
    const form: IntakeForm = { ...defaultForm, ...(body.form || {}) };
    const hasRequiredFields =
      form.entityType === 'brand'
        ? Boolean(form.name.trim() && form.industry.trim())
        : Boolean(form.name.trim() && form.category.trim());

    if (!hasRequiredFields) {
      return NextResponse.json({ error: form.entityType === 'brand' ? '缺少品牌名称或所属行业' : '缺少名称或品类' }, { status: 400 });
    }

    const result = await generateQuestions(form, locale);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '生成问题失败' },
      { status: 500 }
    );
  }
}
