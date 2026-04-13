const files = app.vault.getMarkdownFiles();
const resolved = new Map();
const graph = {};

files.forEach(f => { resolved.set(f.basename, f.path); resolved.set(f.path, f.path); });

// 构建每篇笔记的出链、标签、属性
files.forEach(f => {
  const cache = app.metadataCache.getFileCache(f);
  if (!cache) return;

  const seen = new Set();
  const links = (cache.links || []).map(l => {
    const key = l.link + '|' + l.displayText;
    if (seen.has(key) || l.link.includes('模板')) return null;
    seen.add(key);
    return { display: l.displayText, target: resolved.get(l.link) || l.link };
  }).filter(Boolean);

  const tags = (cache.tags || []).map(t => t.tag);
  const fm = cache.frontmatter || {};
  const properties = {};
  for (const [k, v] of Object.entries(fm)) {
    if (k === 'position') continue;
    properties[k] = v;
  }

  graph[f.path] = { tags, properties, links };
});

// 构建入链（backlinks）
const backlinks = {};
files.forEach(f => {
  const cache = app.metadataCache.getFileCache(f);
  if (!cache?.links) return;
  (cache.links || []).forEach(l => {
    const target = resolved.get(l.link);
    if (!target || l.link.includes('模板')) return;
    if (!backlinks[target]) backlinks[target] = [];
    if (!backlinks[target].some(b => b.source === f.path)) {
      backlinks[target].push({ source: f.path, display: l.displayText });
    }
  });
});

// 合并出链和入链
const entries = Object.entries(graph).map(([path, info]) => ({
  path,
  ...info,
  backlinks: backlinks[path] || []
}));

// 统计
const allPaths = new Set(files.map(f => f.path));
const hasOut = new Set(entries.filter(e => e.links.length).map(e => e.path));
const hasIn = new Set(Object.keys(backlinks));
const orphans = [...allPaths].filter(p => !hasOut.has(p) && !hasIn.has(p) && !p.includes('模板'));

JSON.stringify({
  stats: {
    total: files.length,
    withLinks: hasOut.size,
    withBacklinks: hasIn.size,
    orphans: orphans.length
  },
  graph: entries.sort((a, b) => a.path.localeCompare(b.path)),
  orphans
}, null, 2)
