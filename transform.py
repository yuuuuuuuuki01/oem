import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# We want to replace everything inside <body>...</body> EXCEPT <script src="./app.js"></script>
# Let's extract the pieces we need using regex.

def get_block(regex):
    m = re.search(regex, html, re.DOTALL)
    return m.group(0) if m else ""

# 1. Project Panel
project_panel = get_block(r'<section class="panel" id="project-panel">.*?</section>\s*(?=<section|<div|$)')
# 2. Recipe Panel
recipe_panel = get_block(r'<section class="panel" id="recipe-panel">.*?</section>\s*(?=<section|<div|$)')
# 3. Cost Panel
cost_panel = get_block(r'<section class="panel" id="cost-panel">.*?</section>\s*(?=<section|<div|$)')
# 4. Packaging Panel (it doesn't have an ID, it's right after cost_panel)
packaging_panel = get_block(r'<section class="panel">\s*<div class="panel-header">\s*<div>\s*<p class="eyebrow">Packaging</p>.*?</section>')
# 5. Summary Grid
summary_grid = get_block(r'<section class="summary-grid">.*?</section>')
# 6. Quote Preview
quote_preview = get_block(r'<section class="panel" id="quote-preview">.*?</section>')
# 7. Breakdown
quote_breakdown = get_block(r'<section class="panel" id="quote-breakdown">.*?</section>')
# 8. Assumptions
assumptions = get_block(r'<section class="panel">\s*<div class="panel-header">\s*<div>\s*<p class="eyebrow">Assumptions</p>.*?</section>')
# 9. Hero Actions (Buttons)
hero_actions = get_block(r'<div class="hero-actions">.*?</div>')

new_body = f"""  <body>
    <div class="calculator-app">
      
      <!-- LEFT PANE: KEYPAD / INPUTS -->
      <main class="keypad-area">
        <header class="app-header">
          <h1>Sake Pricing Calculator</h1>
          <p>クリーン＆ダイレクトな見積計算ツール</p>
          {hero_actions}
        </header>

        <div class="inputs-flow">
          {project_panel}
          {recipe_panel}
          {cost_panel}
          {packaging_panel}
        </div>
      </main>

      <!-- RIGHT PANE: CALCULATOR SCREEN -->
      <aside class="screen-area">
        <div class="lcd-display">
          <div class="lcd-top">
            <span class="lcd-label">ESTIMATED TOTAL (INC. TAX)</span>
          </div>
          <div class="lcd-value" id="summary-total">¥0</div>
          
          <div class="lcd-metrics">
            <div class="metric">
              <span class="metric-label">UNIT PRICE</span>
              <span class="metric-val" id="summary-unit-bottle">¥0</span>
            </div>
            <div class="metric">
              <span class="metric-label">COST / LITER</span>
              <span class="metric-val" id="summary-liquid-unit-cost">¥0</span>
            </div>
            <div class="metric">
              <span class="metric-label">VOLUME</span>
              <span class="metric-val" id="summary-brew-volume">0 L</span>
            </div>
          </div>
        </div>

        <div class="screen-body">
          {quote_preview}
          {quote_breakdown}
          {assumptions}
        </div>
      </aside>

    </div>

    <!-- Hidden elements for JS binding compat -->
    <div style="display:none;" id="hidden-legacy">
      <p id="summary-liquor-tax">¥0</p>
      <p id="summary-alcohol-percent">0%</p>
    </div>

    <script src="./app.js"></script>
  </body>"""

# Replace the entire body
new_html = re.sub(r'<body>.*?</body>', new_body, html, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_html)
print("HTML transformed to calculator UX successfully.")
