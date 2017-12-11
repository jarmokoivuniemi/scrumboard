from flask import Flask, render_template, jsonify

app = Flask(__name__)

lists = [
        {
            'name': 'TODO',
            'cards': [
                {
                    'title': 'TDD AngularJS',
                    'description': '...or die trying',
                    'list': 'TODO',
                },
                {
                    'title': 'Fix HTML',
                    'description': '...or die trying',
                    'list': 'TODO',
                }
                ]
        },
        {
            'name': 'Doing',
            'cards': [
                ]
        },
        ]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/lists')
def get_listts():
    return jsonify(lists)


if __name__ == '__main__':
    app.run(debug=True)
