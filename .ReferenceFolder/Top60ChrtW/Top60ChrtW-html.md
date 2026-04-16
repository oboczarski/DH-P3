<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Top 15 — KTC Rank vs. ADP</title>
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
          <h2>SFLX · Top 15 — KTC Rank vs. ADP</h2>
        </div>

        <div class="widget-body">
          <div class="chart-shell">
            <div id="posChart" class="chart"></div>
            <div class="axis-title axis-title-y" style="left: -16px;">Player</div>
          </div>

          <div id="summaryChips" class="chips-row"></div>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>
