<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2026 NFL Prospect Grades • Tier Map</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Product+Sans:wght@100;200;300;400;500;700;900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Google+Sans:100,200,300,400,500,600,700"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="page">
      <div class="widget-card">
        <div class="widget-header">
          <h2>2026 NFL Prospect Grades • Tier Map</h2>
          <div class="tier-legend" aria-label="Tier legend">
            <span class="tier-legend-item tier-legend-item-1">
              <span class="tier-legend-dot"></span>
              Tier 1
            </span>
            <span class="tier-legend-item tier-legend-item-2">
              <span class="tier-legend-dot"></span>
              Tier 2
            </span>
            <span class="tier-legend-item tier-legend-item-3">
              <span class="tier-legend-dot"></span>
              Tier 3
            </span>
            <span class="tier-legend-item tier-legend-item-4">
              <span class="tier-legend-dot"></span>
              Tier 4
            </span>
          </div>
        </div>

        <div class="widget-body">
          <div class="chart-shell">
            <div id="posChart" class="chart"></div>
          </div>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>
