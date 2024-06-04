from flask import Flask
from flask import request
from flask import Response
from flask import jsonify
import ratemyprofessor

app = Flask(__name__)

# needs post method to accept a body
@app.route('/get_professor_w_college_professor', methods=['POST'])
def rateMyProfessorAPI ():
    data = request.data
    school = ratemyprofessor.get_school_by_name("Ohio University")
    response = ratemyprofessor.get_professor_by_school_and_name(school, data)
    if response is not None:
        Response.status(200).send(response)
        print(response)
        
    else:
        Response.status(403).send("Professor not found")