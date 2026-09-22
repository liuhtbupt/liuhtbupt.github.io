# 论文 PDF 临时处理目录

把需要提取摘要和候选缩略图的论文 PDF 放在这里。

请尽量使用 `content/publications.bib` 中每篇论文开头的 BibTeX 标识命名，例如：

```text
liu2026wctnet.pdf
liu2026cooperative.pdf
liu2025multipath.pdf
```

PDF 文件已被 `.gitignore` 排除，不会随网站提交到 GitHub。处理完成后，正式摘要会写入 `content/publications.bib`，确认采用的缩略图会放入 `public/papers/`。

## 本地批量处理

在 `new-website` 目录执行：

```powershell
python scripts/extract-pdf-abstracts.py
python scripts/extract-pdf-previews.py
npm run build
```

第一个脚本读取 PDF 的正式英文摘要并写入 BibTeX；第二个脚本优先截取每篇论文的 Figure 1，找不到时使用论文首页，并自动填写 `preview`。重新运行会覆盖旧的自动结果，因此手工调整过的摘要或图片请先备份。

## PDF 命名清单

| 序号 | PDF 文件名 | 论文标题 |
| ---: | --- | --- |
| 1 | `liu2026wctnet.pdf` | WCTNet-ISAC: A Two-Stage Scheme with CSI Enhancement and High-Precision Synchronization for Uplink ISAC Signal Processing |
| 2 | `liu2026cooperative.pdf` | Cooperative Sensing in Cell-Free Massive MIMO ISAC Systems: Performance Optimization and Signal Processing |
| 3 | `liu2025multipath.pdf` | Multipath Component-Enhanced Signal Processing for Integrated Sensing and Communication Systems |
| 4 | `liu2025carrier.pdf` | Carrier Aggregation Enabled MIMO-OFDM Integrated Sensing and Communication |
| 5 | `liu2024compressed.pdf` | Integrated Sensing and Communication Signal Processing Based on Compressed Sensing Over Unlicensed Spectrum Bands |
| 6 | `wei2024carrier.pdf` | Carrier Aggregation Enabled Integrated Sensing and Communication Signal Design and Processing |
| 7 | `wei2024passive.pdf` | Integrated Sensing and Communication Enabled Cooperative Passive Sensing Using Mobile Communication System |
| 8 | `liu2026event.pdf` | Beyond Target-Level: ISAC-Enabled Event-Level Sensing for Behavioral Intention Prediction |
| 9 | `liu2026allpole.pdf` | Signal Processing Algorithm Based on All-Pole Model for ISAC Multi-Band Fusion Signals |
| 10 | `li2025multirsu.pdf` | Uplink Multi-RSU Cooperative Sensing Strategy for Integrated Sensing and Communication System |
| 11 | `wei2024reference.pdf` | Multiple Reference Signals Collaborative Sensing for Integrated Sensing and Communication System Towards 5G-A and 6G |
| 12 | `sun2026movable.pdf` | Movable Antenna Assisted Flexible Beamforming for Integrated Sensing and Communication in Vehicular Networks |
| 13 | `niu2025energy.pdf` | Energy-Efficient Interference Cancellation for Coordinated Multi-Point ISAC Systems |
| 14 | `yang2025strain.pdf` | Strain-Invariant Stretchable Antennas via Radical Surface Current Re-Distributions: Theory, Design and Experiments |
| 15 | `wei2026rotor.pdf` | Rotor Micro-Doppler Extraction in Protocol-Driven TDD ISAC With Periodic Sparse Sampling |
| 16 | `yang2026dualidentifier.pdf` | Physical-Digital Space Dual-Identifier-Driven Secure Communication for Intelligent Machines: Key Technologies and Hardware Platform |
| 17 | `zhang2026passive.pdf` | Multi-Base Station Passive Cooperative Sensing Technology Based on Integrated Sensing and Communication |
| 18 | `wei2026leo.pdf` | ISAC-Empowered LEO Constellation Networked Sensing: Challenges and Opportunities |
| 19 | `wei2024deep.pdf` | Deep Cooperation in ISAC System: Resource, Node and Infrastructure Perspectives |
| 20 | `wei2026uav.pdf` | Integrated Sensing, Communication and Control Enabled Agile UAV Swarm |
| 21 | `liu2025localization.pdf` | Target Localization with Macro and Micro Base Stations Cooperative Sensing |
| 22 | `liu2025component.pdf` | Multipath Component-Aided Signal Processing for Integrated Sensing and Communication Systems |
| 23 | `zan2026ris.pdf` | Array Configuration and Signal Processing for RIS-Assisted Integrated Sensing and Communication Systems |
| 24 | `chen2026multiagent.pdf` | Multi-Agent Path Planning for Integrated Sensing, Communication, and Control Systems |
| 25 | `xu2025delay.pdf` | Delay Performance Analysis with Short Packets in Intelligent Machine Network |
| 26 | `wang2025factory.pdf` | ISAC 3D Imaging in Smart Factories Assisted by Multipath Components |
| 27 | `zheng2025urban.pdf` | ISAC 3D Imaging in Urban Environments: A Joint Active and Passive Sensing Approach |
| 28 | `chen2026adaptive.pdf` | Adaptive Resource Management for Multi-AGV Integrated Sensing, Communication, and Control Systems |
| 29 | `liu2026dmsnet.pdf` | DMSNet: Cross-Band Learning for Multi-Target Sensing in Dual-Band ISAC |
| 30 | `wei2026hardware.pdf` | A Hardware Prototype of Integrated Sensing, Communication and Control Enabled Intelligent Machine Network |
| 31 | `liu2026beyondsingleband.pdf` | Beyond Single-Band: Analysis and Resource Allocation for Multi-Band ISAC Systems |
