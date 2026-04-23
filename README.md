# 她在正午重开人生

一个部署到 GitHub Pages 的静态日更站点，用来展示女主在现实生活里的选择分支（A / B / D）与复盘。

## 结构

- `site/`：GitHub Pages 发布内容
- `site/data/chapters.json`：章节数据
- `site/data/site-metadata.json`：站点元数据
- `.github/workflows/deploy-pages.yml`：Pages 部署工作流

## 本地预览

```bash
cd site
python3 -m http.server 8765
```

打开 <http://localhost:8765>

## 更新内容

直接编辑 `site/data/chapters.json` 并 push 到 `main`，Pages 会自动重新部署。
