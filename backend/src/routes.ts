import express from 'express';

const router = express.Router();

// Portal Auth 中间件
const requirePortalAuth = (req: any, res: any, next: any) => {
  const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  if (isLocal) return next();
  const cookies = req.cookies || {};
  if (!cookies.portal_auth) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

// GET /api/settings - 获取保存的配置
router.get('/settings', requirePortalAuth, async (req, res) => {
  try {
    const result = await (await import('./storage.js')).getSettings();
    res.json(result);
  } catch (error) {
    console.error('Failed to retrieve settings:', error);
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// POST /api/settings - 保存所有设置
router.post('/settings', requirePortalAuth, async (req, res) => {
  try {
    const {
      useMockLLM,
      llmEndpoint,
      llmKey,
      llmModel,
      useMockImage,
      imageEndpoint,
      imageKey,
      imageModel,
    } = req.body;

    await (await import('./storage.js')).saveSettings({
      useMockLLM,
      llmEndpoint,
      llmKey,
      llmModel,
      useMockImage,
      imageEndpoint,
      imageKey,
      imageModel,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
