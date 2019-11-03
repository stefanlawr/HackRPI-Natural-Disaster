import json
import os
from watson_developer_cloud import VisualRecognitionV3
from flask import Flask, request, render_template, flash, redirect, url_for
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    marker_color = ''
    if request.method == 'POST':

        # Grab the file name from POST request
        file = request.files['file']

        # If filename empty (user didn't upload a file via POST)
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        
        # User selected a file and this file is valid
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            data = send_to_IBM(filename)
            parsed_json = json.loads(data)
            print(parsed_json)

            # Parse the score out of the returned JSON blob. If the threshold is greater
            # than 0.6, the send_to_IBM function returns no 'score' index, so the area
            # must not be flooded and we indicate it as such w a score of 0 and green marker
            try:
                score = float(parsed_json["images"][0]["classifiers"][0]["classes"][0]["score"])
                print("We believe this area is flooded!")
                marker_color = 'red'
            except:
                print("This area is not flooded")
                score = 0.0
                marker_color = 'green'
    return render_template('index.html', marker_color = marker_color)

# PARAM: filename
# RETURNS: return true if filename has a file extension and extension is in ALLOWED_EXTENSIONS
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# PARAM: filename
# USAGE: use the IBM Watson Cloud Visual Recognition API to test the uploaded image against 
#        the model, using a threshold of 0.6 or 60% confidence
# RETURNS: JSON from the 
def send_to_IBM(filename):
    visual_recognition = VisualRecognitionV3(
    '2018-03-19',
    iam_apikey='YBZQz6j5R-x5oGItFETE9XNfQuVi5u50N0nKffLcnDzK')
    
    with open('./testdata/'+filename, 'rb') as images_file:
        classes = visual_recognition.classify(
            images_file,
            threshold='0.6',
        classifier_ids='floodzone-nav-model_1793631775').get_result()
    return json.dumps(classes, indent=2)

if __name__ == '__main__':
   app.run(debug = True)