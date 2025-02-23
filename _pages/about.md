---
permalink: /
title: "Biography"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div class="cv-container">

<div class="cv-card intro-card">
  <p class="cv-intro">
    <span class="cv-name">Haotian Liu</span>, 
    <a href="https://www.ieee.org/membership/index.html" class="tech-badge">IEEE Graduate Student Member</a>
    <a href="https://www.comsoc.org/" class="tech-badge">IEEE ComSoc Member</a>
    <a href="https://www.cie.org.cn/" class="tech-badge">CIE Student Member</a>
    <a href="https://www.china-cic.cn/" class="tech-badge">CIC Student Member</a>, 
    received the B.E. degree in School of Physics and Electronic Information Engineering, 
    <a href="https://www.hpu.edu.cn/">Henan Polytechnic University (HPU)</a> in 2023. 
    Currently pursuing Ph.D. at 
    <a href="https://mekluwc.bupt.edu.cn/index.htm">Key Laboratory of Universal Wireless Communications</a>, 
    <a href="https://www.bupt.edu.cn/">BUPT</a>.
  </p>

  <div class="contact-grid">
    <a href="https://www.scholat.com/haotianliubupt" class="contact-btn">
      <i class="fas fa-file-pdf"></i> Chinese CV
    </a>
    <a href="mailto:haotian_liu@bupt.edu.cn" class="contact-btn">
      <i class="fas fa-envelope"></i> Email
    </a>
    <span class="contact-btn">
      <i class="fab fa-weixin"></i> WeChat: +86 15738993901
    </span>
  </div>
</div>

<div class="cv-card">
  <h2 class="section-title"><i class="fas fa-graduation-cap"></i> Education</h2>
  <div class="cv-timeline">
    <div class="cv-timeline-item">
      <div class="timeline-header">
        <h3>2023 - Present</h3>
        <span class="timeline-sub">Beijing University of Posts and Telecommunications</span>
      </div>
      <div class="timeline-content">
        Ph.D. Candidate in Information and Communication Engineering<br>
        <em>Recommended for Graduate Studies（推免）and admitted via direct entry (硕博连读)</em><br>
        <div class="supervisors">
          <span>Supervisors:</span>
          <a href="https://sice.bupt.edu.cn/info/1010/1648.htm">Prof. Zhiyong Feng (Master)</a>, 
          <a href="https://teacher.bupt.edu.cn/weizhiqing/zh_CN/index.htm">Prof. Zhiqing Wei (Ph.D.)</a>
        </div>
      </div>
    </div>

    <div class="cv-timeline-item">
      <div class="timeline-header">
        <h3>2019 - 2023</h3>
        <span class="timeline-sub">Henan Polytechnic University</span>
      </div>
      <div class="timeline-content">
        Bachelor of Engineering in Electronic Information Engineering<br>
        Supervisor: <a href="https://wdxy.hpu.edu.cn/info/1078/1919.htm">Prof. Xingwang Li</a>
      </div>
    </div>
  </div>
</div>

<div class="cv-card">
  <h2 class="section-title"><i class="fas fa-peer-review"></i> Academic Service</h2>
  <div class="service-list">
    <div class="service-item">
      <i class="fas fa-review"></i>
      <h3>Peer Reviewer for:</h3>
      <ul class="journal-list">
        <li>IEEE Transactions on Communications</li>
        <li>IEEE Transactions on Cognitive Communications and Networking</li>
        <li>IEEE Internet of Things Journal</li>
      </ul>
    </div>
  </div>
</div>

<div class="cv-card">
  <h2 class="section-title"><i class="fas fa-file-alt"></i> Selected Publications</h2>
  <div class="pub-list">
    {% for paper in site.data.papers %}
    <div class="pub-item">
      <div class="pub-index">{{ forloop.index }}.</div>
      <div class="pub-content">
        <div class="pub-title">{{ paper.title }}</div>
        <div class="pub-meta">
          <span class="pub-authors">{{ paper.authors }}</span>
          <span class="pub-journal">{{ paper.journal }}</span>
          <span class="pub-date">{{ paper.date }}</span>
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<div class="cv-card">
  <h2 class="section-title"><i class="fas fa-certificate"></i> Patents</h2>
  <div class="patent-grid">
    {% for patent in site.data.patents %}
    <div class="patent-item">
      <div class="patent-number">CN {{ patent.number }}</div>
      <div class="patent-title">{{ patent.title }}</div>
      <div class="patent-meta">
        <span>{{ patent.inventors }}</span>
        <span>{{ patent.date }}</span>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<div class="cv-card">
  <h2 class="section-title"><i class="fas fa-flask"></i> Research Interests</h2>
  <div class="tag-cloud">
    <span class="research-tag">Integrated Sensing and Communication (ISAC)</span>
    <span class="research-tag">Cooperative Sensing</span>
    <span class="research-tag">Compressed Sensing (CS)</span>
    <span class="research-tag">Carrier Aggregation (CA)</span>
    <span class="research-tag">AI-Driven Communication Systems</span>
  </div>
</div>

</div>
