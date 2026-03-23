import { chromium } from 'playwright';

import {
  platformLabels,
  type IntakeForm,
  type Locale,
  type PlatformName,
} from '@/lib/visibility-audit/shared';

export type PlatformRawAnswer = {
  questionId: string;
  question: string;
  rawSnippet: string;
  screenshotDataUrl?: string;
  links: string[];
};

export type PlatformAuditRawResult = {
  platform: PlatformName;
  status: 'completed' | 'blocked' | 'error';
  note?: string;
  rawAnswers: PlatformRawAnswer[];
};

type PlatformDefinition = {
  key: PlatformName;
  url: string;
  inputSelectors: string[];
  sendSelectors: string[];
};

const PLATFORMS: PlatformDefinition[] = [
  {
    key: 'doubao',
    url: 'https://www.doubao.com/chat/',
    inputSelectors: ['textarea', 'div[contenteditable="true"]', 'div[role="textbox"]'],
    sendSelectors: ['button[type="submit"]', 'button:has-text("发送")'],
  },
  {
    key: 'kimi',
    url: 'https://kimi.moonshot.cn/',
    inputSelectors: ['textarea', 'div[contenteditable="true"]', 'div[role="textbox"]'],
    sendSelectors: ['button[type="submit"]', 'button:has-text("发送")'],
  },
  {
    key: 'deepseek',
    url: 'https://chat.deepseek.com/',
    inputSelectors: ['textarea', 'div[contenteditable="true"]', 'div[role="textbox"]'],
    sendSelectors: ['button[type="submit"]', 'button:has-text("发送")'],
  },
];

const POPUP_SELECTORS = [
  'button:has-text("知道了")',
  'button:has-text("同意")',
  'button:has-text("允许")',
  'button:has-text("关闭")',
  '[aria-label="关闭"]',
  '[aria-label="Close"]',
];

const BLOCK_HINTS = ['登录', '注册', '扫码', '验证码', '安全验证', '请求过于频繁', '访问受限', '请先登录', '异常'];

function getPlatformConfig(platform: PlatformName) {
  return PLATFORMS.find((item) => item.key === platform)!;
}

function getCookiesFromEnv(platform: PlatformName) {
  const raw = process.env.VISIBILITY_AUDIT_COOKIES_JSON;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const rows = parsed[platform];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function applyCookies(context: Awaited<ReturnType<typeof chromium.launch>> extends never ? never : any, platform: PlatformDefinition) {
  const cookies = getCookiesFromEnv(platform.key);
  if (!cookies.length) return 0;
  await context.addCookies(cookies as Parameters<typeof context.addCookies>[0]);
  return cookies.length;
}

async function closePopups(page: any) {
  for (const selector of POPUP_SELECTORS) {
    const button = page.locator(selector).first();
    try {
      if (await button.isVisible({ timeout: 400 })) {
        await button.click({ timeout: 800 });
        await page.waitForTimeout(150);
      }
    } catch {
      // ignore
    }
  }
}

async function detectBlockReason(page: any) {
  const text = await page.evaluate(() => (document.body?.innerText || '').slice(0, 5000));
  const hit = BLOCK_HINTS.find((item) => text.includes(item));
  return hit ? `页面出现疑似拦截提示：${hit}` : '';
}

async function getVisibleInput(page: any, selectors: string[]) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      if (await locator.isVisible({ timeout: 500 })) {
        return locator;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

async function submitQuestion(page: any, platform: PlatformDefinition, question: string) {
  const input = await getVisibleInput(page, platform.inputSelectors);
  if (!input) {
    return { ok: false, reason: '未找到可输入聊天框' };
  }

  const tagName = await input.evaluate((node: Element) => node.tagName.toLowerCase()).catch(() => '');
  await input.click({ timeout: 3000 }).catch(() => {});

  if (tagName === 'textarea' || tagName === 'input') {
    await input.fill(question, { timeout: 10000 });
  } else {
    await input.fill('');
    await input.type(question, { delay: 10, timeout: 15000 });
  }

  try {
    await input.press('Enter', { timeout: 1000 });
    return { ok: true };
  } catch {
    for (const selector of platform.sendSelectors) {
      const button = page.locator(selector).first();
      try {
        if (await button.isVisible({ timeout: 500 })) {
          await button.click({ timeout: 2000 });
          return { ok: true };
        }
      } catch {
        // ignore
      }
    }
  }

  return { ok: false, reason: '问题已填写，但未成功发送' };
}

async function waitForStableResponse(page: any, timeoutMs = 45000) {
  const start = Date.now();
  let stableRounds = 0;
  let lastText = '';

  while (Date.now() - start < timeoutMs) {
    const text = await page.evaluate(() => (document.body?.innerText || '').slice(-2000));
    if (text && text === lastText) {
      stableRounds += 1;
    } else {
      stableRounds = 0;
    }
    lastText = text;

    if (stableRounds >= 3) {
      return { ok: true };
    }

    await page.waitForTimeout(2500);
  }

  return { ok: false, reason: '等待回答超时' };
}

async function extractExternalLinks(page: any, platformUrl: string) {
  const platformHost = new URL(platformUrl).hostname.replace(/^www\./i, '');
  return page.evaluate((host: string) => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map((node) => {
        const href = (node.getAttribute('href') || '').trim();
        const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
        return { href, text };
      })
      .filter((item) => /^https?:\/\//i.test(item.href))
      .filter((item) => {
        try {
          const currentHost = new URL(item.href).hostname.replace(/^www\./i, '');
          return currentHost !== host;
        } catch {
          return false;
        }
      })
      .slice(0, 12)
      .map((item) => item.href);
  }, platformHost);
}

async function captureAnswerSnippet(page: any, beforeText: string) {
  const afterText = await page.evaluate(() => (document.body?.innerText || '').trim());
  if (!afterText) return '';

  if (afterText.startsWith(beforeText)) {
    return afterText.slice(beforeText.length).trim().slice(-1600);
  }

  return afterText.slice(-1600);
}

async function captureAnswerScreenshot(page: any) {
  try {
    const body = page.locator('body');
    if (await body.isVisible({ timeout: 1000 })) {
      const buffer = await body.screenshot({
        type: 'jpeg',
        quality: 48,
        scale: 'css',
        timeout: 8000,
      });
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
  } catch {
    // ignore
  }

  try {
    const buffer = await page.screenshot({
      type: 'jpeg',
      quality: 48,
      fullPage: false,
      scale: 'css',
      timeout: 8000,
    });
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch {
    return undefined;
  }
}

export async function auditPlatform(platform: PlatformName, questions: { id: string; question: string }[], form: IntakeForm, locale: Locale) {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  let context: Awaited<ReturnType<Awaited<ReturnType<typeof chromium.launch>>['newContext']>> | null = null;

  const definition = getPlatformConfig(platform);

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-dev-shm-usage', '--no-sandbox'],
    });

    context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: locale === 'zh' ? 'zh-CN' : 'en-US',
      timezoneId: 'Asia/Shanghai',
    });

    await applyCookies(context, definition).catch(() => 0);
    const page = await context.newPage();
    page.setDefaultTimeout(45000);
    await page.goto(definition.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1000);
    await closePopups(page);

    const preBlock = await detectBlockReason(page);
    if (preBlock) {
      return {
        platform,
        status: 'blocked',
        note: preBlock,
        rawAnswers: [],
      } satisfies PlatformAuditRawResult;
    }

    const input = await getVisibleInput(page, definition.inputSelectors);
    if (!input) {
      return {
        platform,
        status: 'blocked',
        note: locale === 'zh' ? '未找到可输入聊天框，平台可能要求登录。' : 'No visible chat input was found. The platform may require login.',
        rawAnswers: [],
      } satisfies PlatformAuditRawResult;
    }

    const rawAnswers: PlatformRawAnswer[] = [];
    for (const question of questions.slice(0, 3)) {
      const beforeText = await page.evaluate(() => (document.body?.innerText || '').trim());
      const submit = await submitQuestion(page, definition, question.question);
      if (!submit.ok) {
        return {
          platform,
          status: 'blocked',
          note: submit.reason,
          rawAnswers,
        } satisfies PlatformAuditRawResult;
      }

      const settled = await waitForStableResponse(page, 45000);
      if (!settled.ok) {
        return {
          platform,
          status: 'error',
          note: settled.reason,
          rawAnswers,
        } satisfies PlatformAuditRawResult;
      }

      rawAnswers.push({
        questionId: question.id,
        question: question.question,
        rawSnippet: (await captureAnswerSnippet(page, beforeText)) || (locale === 'zh' ? '未抓取到有效回答片段。' : 'No answer snippet was captured.'),
        screenshotDataUrl: await captureAnswerScreenshot(page),
        links: await extractExternalLinks(page, definition.url),
      });

      await page.waitForTimeout(1200);
    }

    return {
      platform,
      status: 'completed',
      note:
        locale === 'zh'
          ? `${platformLabels[platform].zh} 已完成真实平台检测。`
          : `${platformLabels[platform].en} completed a live platform check.`,
      rawAnswers,
    } satisfies PlatformAuditRawResult;
  } catch (error) {
    return {
      platform,
      status: 'error',
      note: error instanceof Error ? error.message : '平台检测失败',
      rawAnswers: [],
    } satisfies PlatformAuditRawResult;
  } finally {
    await context?.close().catch(() => {});
    await browser?.close().catch(() => {});
  }
}
