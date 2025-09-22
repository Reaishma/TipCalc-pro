from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Currency symbols mapping
CURRENCY_SYMBOLS = {
    'USD': '$',
    'EUR': '€', 
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'CHF': 'Fr.'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate_tip():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
            
        bill_amount = float(data.get('bill_amount', 0))
        tip_percentage = float(data.get('tip_percentage', 0))
        people_count = int(data.get('people_count', 1))
        currency = data.get('currency', 'USD')
        
        # Validate inputs
        if bill_amount < 0:
            return jsonify({'success': False, 'error': 'Bill amount cannot be negative'}), 400
        if tip_percentage < 0 or tip_percentage > 100:
            return jsonify({'success': False, 'error': 'Tip percentage must be between 0 and 100'}), 400
        if people_count <= 0:
            return jsonify({'success': False, 'error': 'Number of people must be at least 1'}), 400
        
        # Calculate tip and totals
        tip_amount = bill_amount * (tip_percentage / 100)
        total_amount = bill_amount + tip_amount
        amount_per_person = total_amount / people_count
        tip_per_person = tip_amount / people_count
        bill_per_person = bill_amount / people_count
        
        # Get currency symbol
        currency_symbol = CURRENCY_SYMBOLS.get(currency, '$')
        
        return jsonify({
            'success': True,
            'tip_amount': round(tip_amount, 2),
            'total_amount': round(total_amount, 2),
            'amount_per_person': round(amount_per_person, 2),
            'tip_per_person': round(tip_per_person, 2),
            'bill_per_person': round(bill_per_person, 2),
            'currency_symbol': currency_symbol,
            'bill_percentage': round((bill_amount / total_amount * 100) if total_amount > 0 else 100, 1),
            'tip_percentage_actual': round((tip_amount / total_amount * 100) if total_amount > 0 else 0, 1)
        })
    except (ValueError, TypeError) as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/currency-symbol/<currency>')
def get_currency_symbol(currency):
    return jsonify({
        'symbol': CURRENCY_SYMBOLS.get(currency, '$')
    })

@app.route('/sw.js')
def service_worker():
    return app.send_static_file('sw.js')

@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')

if __name__ == '__main__':
    import os
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)