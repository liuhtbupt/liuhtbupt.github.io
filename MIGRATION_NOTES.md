# PRISM 网站迁移记录

本文件记录迁移过程中已经完成的工作、明确修正的问题，以及仍需本人确认的科研信息。旧版 Jekyll 网站是本次迁移的内容来源；新站没有添加旧站无法支持的科研事实。

## 已迁移内容

- 英文个人简介和 7 个研究方向
- 6 条近期动态
- 2 段教育经历
- 27 篇论文：17 篇期刊论文、3 篇杂志论文、7 篇会议论文
- 7 项奖励
- 7 条专利记录
- 期刊审稿、Workshop Co-Chair 和 TPC Member 等学术服务
- 个人头像
- Google Scholar、ORCID、GitHub、ResearchGate、arXiv、学校主页和论文页面链接
- GitHub Pages 自动构建和部署配置

## 仍需本人确认

1. **精选论文：**已按本人确认改为 Cooperative Sensing、WCTNet-ISAC、Multipath Component-Enhanced、Carrier Aggregation Enabled MIMO-OFDM、Compressed Sensing Over Unlicensed Spectrum Bands 五篇。如需再次调整，在相应 BibTeX 记录中增删 `selected = {true}` 即可。
2. **专利数量和状态：**Biography 写的是“12 项授权专利”，但 Patents 页面只列出 7 条，而且编号形式更像专利申请号。新站暂时统一写成“专利申请”，需要确认授权状态并补齐缺少的 5 项。
3. **奖项缺项：**Biography 提到“AICTech 2026 Academic Pioneer Award”和“AICTech 2026 Best Paper Award”，但 Awards 页面没有列出，暂未加入奖项页面。
4. **CCAI 奖项名称：**Biography 写的是“Best Paper Award of CCAI 2026”，Awards 页面写的是“Best Student Paper Award of CCAI 2026”。新站暂时采用信息更具体的后者。
5. **论文总数：**Biography 写“发表论文 30 余篇，其中 IEEE Transactions 论文 12 篇”，但旧站三个论文页面目前一共只有 27 条，需要核对是否还有遗漏论文。
6. **2026 年论文状态：**部分论文日期为 2026 年，需要确认分别属于正式发表、Early Access、已录用还是待刊。
7. **论文摘要和缩略图：**PRISM 已支持摘要展开和论文图片。本轮已通过 Crossref 核实并补充 24 条 DOI；Crossref 没有返回这些论文的摘要。缺少正式图片时网站会自动显示统一的 ISAC 视觉卡片，但不会自动从论文中截取图片。后续可将 PDF 放入 `source-pdfs/`，批量提取正式摘要和候选缩略图，再由本人确认图片。
8. **中文版本：**旧网站主要是英文。当前中文内容是根据英文内容整理的初版，姓名、奖项、专利名称和专业术语仍建议本人复核。
9. **联系方式隐私：**旧 Biography 中公开的微信号码没有迁移。如果确实希望继续公开，可以再手动添加。
10. **专利链接：**旧站多个 CNKI 链接包含临时查询参数，还有一个需要校园代理，因此只保留了稳定的官方查询入口。

## 已明确修正的问题

- 将旧配置中错误或乱码的姓名统一为 `Haotian Liu`。
- 在含义明确的情况下恢复 News 页面乱码的中文媒体名称。
- 将 `Qucik URL` 等明显拼写错误改为正常链接文字。
- 删除 Academic Pages 与 PRISM 原模板中的虚构人物、示例学校和示例论文；按本人要求移除了独立 CV 页面。
- 删除“关于我”底部重复的文字链接，将中文学术主页、arXiv 和 ResearchGate 移入左侧个人资料图标区。
- 近期动态现已正确渲染 Markdown 超链接，不再直接显示链接语法或长网址。
- 论文卡片支持按各篇论文采用的年份版本显示中科院大类分区、Top、JCR 分区和影响因子；学术服务不展示这些论文评价指标。
- 将中文页面中误写的“魏志强”全部更正为“尉志青”。
- 按本人提供的原 Biography 将中英文个人简介恢复为两段式正文，不再使用分列式小标题。
- 添加每周论文自动监测：通过 Crossref 和个人身份信息发现候选新论文，创建 GitHub Issue 提醒核对并上传 PDF；出于 Google Scholar 的自动访问限制，不直接抓取 Scholar 页面，也不会未经确认发布论文。
- 访问统计改为与旧站一致的单一“访问量”：首页左侧从 0 显示，只在正式域名加载计数脚本，避免本地预览读取公共 localhost 的错误大数；论文与专利页面继续显示实时计算的总数。
- 删除 PRISM 原作者网站的外部字体依赖。

## 当前发布状态

- 新站已经通过生产构建。
- 本地预览地址为 `http://localhost:3000`。
- 尚未推送到 GitHub，也没有覆盖当前线上旧网站。
