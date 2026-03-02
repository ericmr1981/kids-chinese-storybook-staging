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

// GET /api/settings - 获取保存的 Key
router.get('/settings', requirePortalAuth, async (req, res) => {
  try {
    const settings = await (await import('./storage.js')).getSettings();
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// POST /api/settings - 保存 Key
router.post('/settings', requirePortalAuth, async (req, res) => {
  try {
    const { llmKey, imageKey } = req.body;
    if (!llmKey && !imageKey) return res.status(400).json({ error: 'At least one key required' });
    await (await import('./storage.js')).saveSettings({ llmKey, imageKey });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;