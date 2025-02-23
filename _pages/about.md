---
permalink: /
title: "<i class='fas fa-star'></i> CYBER ACADEMIC PROFILE"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<div class="glow-container">

<div class="cyber-card">
### <span class="hologram-text">🧬 Digital Identity</span>
  
<span class="cyber-button">
  <i class="fas fa-rocket"></i> 
  [IEEE Graduate Student Member](https://www.ieee.org/membership/index.html)
</span>  
<span class="cyber-button">
  <i class="fas fa-satellite"></i> 
  [CIE Student Member](https://www.cie.org.cn/)
</span>

### <span class="hologram-text">📡 Contact Matrix</span>
<span class="cyber-button">
  <i class="fas fa-qrcode"></i> 
  [My Chinese CV](https://www.scholat.com/haotianliubupt)
</span>  
<span class="cyber-button">
  <i class="fas fa-envelope"></i> 
  [Email Me](mailto:haotian_liu@bupt.edu.cn)
</span>  
<span class="cyber-button">
  <i class="fab fa-weixin"></i> 
  Wechat: +86 15738993901
</span>
</div>

---

<div class="cyber-timeline">
### <span class="hologram-text">⏳ Academic Journey</span>

<div class="timeline-node pulse">
<h3 class="neon-title">2023 - Present</h3>
<div class="cyber-content">
  <i class="fas fa-brain-circuit"></i> Beijing University of Posts and Telecommunications<br>
  <span class="glow-text">Ph.D. in Information and Communication Engineering</span><br>
  <i class="fas fa-wifi"></i> Research Focus: ISAC, Compressed Sensing
</div>
</div>

<div class="timeline-node pulse">
<h3 class="neon-title">2019 - 2023</h3>  
<div class="cyber-content">
  <i class="fas fa-microchip"></i> Henan Polytechnic University<br>
  <span class="glow-text">Bachelor of Engineering</span><br>  
  <i class="fas fa-project-diagram"></i> Thesis: [Your Thesis Title]
</div>
</div>
</div>

---

<div class="cyber-grid">
<div class="cyber-panel">
### <span class="hologram-text">📡 Research Output</span>

{% for paper in site.data.papers %}
<div class="cyber-paper">
  <div class="paper-flip">
    <div class="paper-front">
      <i class="fas fa-file-code"></i> {{ paper.title }}
    </div>
    <div class="paper-back">
      {{ paper.journal }} | {{ paper.date }}
    </div>
  </div>
</div>
{% endfor %}
</div>

<div class="cyber-panel">
### <span class="hologram-text">⚙️ Patent Matrix</span>

{% for patent in site.data.patents %}
<div class="cyber-patent">
  <i class="fas fa-keyboard"></i> {{ patent.title }}<br>
  <span class="cyber-tag">{{ patent.number }}</span>
</div>
{% endfor %}
</div>
</div>

</div> <!-- glow-container结束 -->
