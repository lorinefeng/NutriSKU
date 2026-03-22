import { auditPlatform } from '@/lib/visibility-audit/platform-audit';
import { summarizeAudit, summarizePlatformResult } from '@/lib/visibility-audit/summarize';
import {
  defaultForm,
  type IntakeForm,
  type Locale,
  type QuestionItem,
  type StreamEvent,
} from '@/lib/visibility-audit/shared';

export const runtime = 'nodejs';
export const maxDuration = 300;

const encoder = new TextEncoder();

function writeEvent(controller: ReadableStreamDefaultController<Uint8Array>, event: StreamEvent) {
  controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      locale?: Locale;
      form?: Partial<IntakeForm>;
      questions?: QuestionItem[];
    };

    const locale = body.locale === 'en' ? 'en' : 'zh';
    const form: IntakeForm = { ...defaultForm, ...(body.form || {}) };
    const questions = Array.isArray(body.questions) ? body.questions.slice(0, 5) : [];

    if (!form.name.trim() || !form.category.trim()) {
      return new Response(JSON.stringify({ error: '缺少名称或品类' }), { status: 400 });
    }
    if (!questions.length) {
      return new Response(JSON.stringify({ error: '缺少选中的问题' }), { status: 400 });
    }

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          writeEvent(controller, {
            type: 'init',
            message: locale === 'zh' ? '开始诊断，正在依次连接 3 个平台。' : 'Starting the audit across 3 platforms.',
          });

          const platformResults = [];
          for (const platform of ['doubao', 'kimi', 'deepseek'] as const) {
            writeEvent(controller, {
              type: 'platform_start',
              platform,
              message:
                locale === 'zh'
                  ? `正在检测 ${platform}...`
                  : `Running ${platform}...`,
            });

            const rawResult = await auditPlatform(
              platform,
              questions.map((item) => ({ id: item.id, question: item.question })),
              form,
              locale
            );
            const summarized = await summarizePlatformResult(rawResult, form, locale);
            platformResults.push(summarized);

            writeEvent(controller, {
              type: 'platform_complete',
              platform,
              result: summarized,
            });
          }

          const auditResult = await summarizeAudit(form, locale, platformResults);
          writeEvent(controller, { type: 'complete', result: auditResult });
          controller.close();
        } catch (error) {
          writeEvent(controller, {
            type: 'error',
            message: error instanceof Error ? error.message : '诊断执行失败',
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : '诊断执行失败' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

