# Tip-calculator-
  Tip Calculator App A simple and intuitive tip calculator app that    Benefits - Saves time and effort in calculating tips - Helps avoid overpaying or underpaying tips - Makes splitting bills with friends easy and convenient - Provides a clear breakdown of the total amount due and amount per person  !
<!DOCTYPE html>
<html>
<head>
  <title>Tip Calculator</title>
  <style>
    /* CSS styles */
  </style>
</head>
<body>
  <h1>Tip Calculator</h1>
  <form>
    <label>Bill Amount:</label>
    <input type="number" id="bill-amount" step="0.01" min="0.01">
    <span id="bill-error" style="color: red;"></span>
    <label>Tip Percentage:</label>
    <select id="tip-percentage">
      <option value="0.10">10%</option>
      <option value="0.15">15%</option>
      <option value="0.20">20%</option>
      <option value="custom">Custom</option>
    </select>
    <input type="number" id="custom-tip" style="display: none;" step="0.01" min="0">
    <label>Round Tip:</label>
    <select id="round-tip">
      <option value="none">None</option>
      <option value="dollar">To nearest dollar</option>
      <option value="cent">To nearest cent</option>
    </select>
    <label>Number of People:</label>
    <input type="number" id="num-people" min="1">
    <span id="people-error" style="color: red;"></span>
    <button id="calculate">Calculate</button>
    <button id="clear" type="reset">Clear</button>
  </form>
  <p id="result"></p>

  <script>
    // JavaScript code
  </script>
</body>
</html>
