import express from 'express';

const router = express.Router();
const ANTHROPIC_BASE_URL = 'https://coding.dashscope.aliyuncs.com/apps/anthropic';
const ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

// Portal Auth 中间件
const requirePortalAuth = (req: any, res: any, next: any) => {
  const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  if (isLocal) return next();
  const cookies = req.cookies || {};
  if (!cookies.portal_auth) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

function buildProxyHeaders(req: express.Request): Headers {
  const headers = new Headers();
  const forwardedHeaderNames = [
    'content-type',
    'accept',
    'authorization',
    'x-api-key',
    'anthropic-version',
  ];

  for (const headerName of forwardedHeaderNames) {
    const value = req.header(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  return headers;
}

async function proxyRequest(
  req: express.Request,
  res: express.Response,
  targetBaseUrl: string,
  routePrefix: string
) {
  try {
    const { getLocalConfig } = await import('./localConfig.js');
    const localConfig = await getLocalConfig();
    const suffix = req.originalUrl.replace(routePrefix, '') || '/';
    const normalizedBaseUrl = targetBaseUrl.endsWith('/') ? targetBaseUrl : `${targetBaseUrl}/`;
    const normalizedSuffix = suffix.startsWith('/') ? suffix.slice(1) : suffix;
    const targetUrl = new URL(normalizedSuffix, normalizedBaseUrl);
    const method = req.method.toUpperCase();
    const hasBody = method !== 'GET' && method !== 'HEAD';
    const headers = buildProxyHeaders(req);

    if (routePrefix === '/api/anthropic') {
      headers.set('x-api-key', localConfig.llmKey);
      headers.set('authorization', `Bearer ${localConfig.llmKey}`);
      headers.set('anthropic-version', headers.get('anthropic-version') ?? '2023-06-01');
    }

    if (routePrefix === '/api/ark') {
      headers.set('authorization', `Bearer ${localConfig.imageKey}`);
    }

    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });

    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) {
      res.setHeader('content-type', contentType);
    }

    const responseBody = Buffer.from(await upstreamResponse.arrayBuffer());
    res.status(upstreamResponse.status).send(responseBody);
  } catch (error) {
    console.error(`Proxy request failed for ${routePrefix}:`, error);
    res.status(502).json({ error: 'Upstream proxy request failed' });
  }
}

// GET /api/settings - 获取保存的配置
router.get('/settings', requirePortalAuth, async (req, res) => {
  try {
    const { getLocalConfig } = await import('./localConfig.js');
    const localConfig = await getLocalConfig();
    res.json({
      hasSavedSettings: true,
      settings: {
        useMockLLM: false,
        llmEndpoint: localConfig.llmEndpoint,
        llmKey: '',
        llmModel: localConfig.llmModel,
        useMockImage: false,
        imageEndpoint: localConfig.imageEndpoint,
        imageKey: '',
        imageModel: localConfig.imageModel,
      },
    });
  } catch (error) {
    console.error('Failed to retrieve settings:', error);
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// POST /api/settings - 保存所有设置
router.post('/settings', requirePortalAuth, async (req, res) => {
  res.status(405).json({
    error: 'Settings are managed via backend/local-config.json on the server.',
  });
});

router.all('/anthropic/*', requirePortalAuth, async (req, res) => {
  await proxyRequest(req, res, ANTHROPIC_BASE_URL, '/api/anthropic');
});

router.all('/ark/*', requirePortalAuth, async (req, res) => {
  await proxyRequest(req, res, ARK_BASE_URL, '/api/ark');
});

export default router;
