from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
from datetime import datetime
from flask import jsonify
import requests
import json
from werkzeug.utils import secure_filename
from database import init_db
from models import User, AccessTokens, Transactions
#
from encrypt import encrypt_password, check_encrypted_password
from pathlib import Path
#
import pandas as pandas
from pandas import read_csv
from pandas import read_excel

app = Flask(__name__)
app.debug = True

# Cross Origin Stuff
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_HEADERS'] = 'Access-Control-Allow-Origin'
# app.config['CORS_RESOURCES'] = {r"/*": {"origins": "*"}}
cors = CORS(app)

# frontend links
frontend_url = 'http://localhost:3000' # development server

root = Path('.')

#USER FUNCTIONS ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
@app.route('/signup', methods=['POST'])
def signup():
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    email = request.form['email']
    phonenumber = request.form['phonenumber']
    address = request.form['address']
    password = request.form['password']
    password = encrypt_password(password)

    existing_users_with_same_email = User.objects.filter(email = email)
    existing_users_with_same_phonenumber = User.objects.filter(phonenumber = phonenumber)
    if len(existing_users_with_same_email) != 0:
        return 'Email already registered'
    elif len(existing_users_with_same_phonenumber) != 0:
        return 'Phone number already registered'
    else:
        auto_admin_emails = [
            ''
            ]
        role = 'user'
        if email in auto_admin_emails:
            role = 'admin'

        user = User(
            firstname = firstname,
            lastname = lastname,
            email = email,
            phonenumber = phonenumber,
            address = address,
            password = password,
            role = role,
            verified = True
        )
        user.save()

        return 'Signup successful'

@app.route('/signin', methods=['POST'])
def signin():
    email = request.form['email']
    password = request.form['password']

    user_verified = User.objects.filter(email = email, verified=True)
    user_not_verified = User.objects.filter(email = email, verified=False)
    
    if len(user_verified) != 0:
        user_encrypted_password = user_verified[0].password
        is_password_entered_true = check_encrypted_password(password, user_encrypted_password)

        if is_password_entered_true == True:
            user_id = user_verified[0].id

            token = AccessTokens(
                user_id = str(user_id),
                active = True,
                signin_date = str(datetime.now())
            )
            token_details = token.save()
            access_token = token_details.id

            return_object = {
                'status': 'successful',
                'id': str(access_token)
            }
            return jsonify(return_object)
        else:
            return_object = {
                'status': 'failed'
            }
            return jsonify(return_object)
    else:
        if len(user_not_verified) != 0:
            user_encrypted_password = user_not_verified[0].password
            is_password_entered_true = check_encrypted_password(password, user_encrypted_password)

            if is_password_entered_true == True:
                return_object = {
                    'status': 'not verified'
                }
                return jsonify(return_object)
            else:
                return_object = {
                    'status': 'failed'
                }
                return jsonify(return_object)
        else:
            return_object = {
                'status': 'failed'
            }
            return jsonify(return_object)

@app.route('/deactivateAccessToken/<token>', methods=['GET'])
def deactivateAccessToken(token):
    try:
        AccessTokens.objects(id=token).update(active = False)
        return 'Token deactivated'
    except:
        return 'Invalid token'

@app.route('/getUserDetailsByAccessToken/<access_token>', methods=['GET'])
def getUserByAccessToken(access_token):
    try:
        user_id = AccessTokens.objects.filter(id=access_token, active = True)[0].user_id
        user_data = User.objects.filter(id=user_id)[0]
        return user_data.to_json()
    except:
        return 'Not authorized'

    return 'Unknown'


# sales data ************************************************************************************************************
@app.route('/submitData', methods=['POST'])
def submitData():
    user_id = ''
    
    try:
        user_access_token = request.form['user_access_token']
        user_id = AccessTokens.objects.filter(id = user_access_token, active = True)[0].user_id
    except:
        return 'Not authorized'

    # read excel file
    excel_file = request.files['excel_file']
    excel_file_name = excel_file.filename
    excel_file_name = secure_filename(excel_file_name)
    excel_file.save(secure_filename(excel_file_name))

    # change excel file to pandas to dataframe
    columns = ['Invoice ID', 'Branch', 'City',	'Customer Type', 'Gender', 'Product Line', 'Unit Price', 'Quantity', 'Tax 5%', 'Total',	'Date',	'Time',	'Payment', 'COGS', 'Gross Margin Percentage', 'Gross Income', 'Rating']
    dataframe = read_excel(excel_file_name, names=columns, dtype='unicode')

    sales_data = []

    for i in range(0, len(dataframe), +1):

        obj = {
            'branch': dataframe['Branch'][i],
            'product_line': dataframe['Product Line'][i],
            'unit_price': dataframe['Unit Price'][i],
            'quantity': dataframe['Quantity'][i],
            'tax_5%': dataframe['Tax 5%'][i],
            'total': dataframe['Total'][i],
            'date': dataframe['Date'][i],
            'time': dataframe['Time'][i],
            'payment': dataframe['Payment'][i],
            'cogs': dataframe['COGS'][i],
            'gross_margin_percentage': dataframe['Gross Margin Percentage'][i],
            'gross_income': dataframe['Gross Income'][i],
            'rating': dataframe['Rating'][i]
        }

        sales_data.append(obj)

    return jsonify(sales_data)

@app.route('/rawData', methods=['POST'])
def rawData():
    user_id = ''
    
    try:
        user_access_token = request.form['user_access_token']
        user_id = AccessTokens.objects.filter(id = user_access_token, active = True)[0].user_id
    except:
        return 'Not authorized'

    # read excel file
    excel_file = request.files['excel_file']
    excel_file_name = excel_file.filename
    excel_file_name = secure_filename(excel_file_name)
    excel_file.save(secure_filename(excel_file_name))

    # change excel file to pandas to dataframe
    columns = ['Invoice ID', 'Branch', 'City',	'Customer type', 'Gender', 'Product line', 'Unit price', 'Quantity', 'Tax 5%', 'Total',	'Date',	'Time',	'Payment', 'cogs', 'gross margin percentage', 'gross income', 'Rating']
    dataframe = read_excel(excel_file_name, names=columns, dtype='unicode')

    # create grid required by react-datasheet
    grid = [
        [
        {'value': '', 'readOnly': 'true'},
        {'value': 'Invoice ID', 'readOnly': 'true'},
        {'value': 'Branch', 'readOnly': 'true'},
        {'value': 'City', 'readOnly': 'true'},
        {'value': 'Customer Type', 'readOnly': 'true'},
        {'value': 'Gender', 'readOnly': 'true'},
        {'value': 'Product Line', 'readOnly': 'true'},
        {'value': 'Unit Price', 'readOnly': 'true'},
        {'value': 'Quantity', 'readOnly': 'true'},
        {'value': 'Tax 5%', 'readOnly': 'true'},
        {'value': 'Total', 'readOnly': 'true'},
        {'value': 'Date', 'readOnly': 'true'},
        {'value': 'Time', 'readOnly': 'true'},
        {'value': 'Payment', 'readOnly': 'true'},
        {'value': 'COGS', 'readOnly': 'true'},
        {'value': 'Gross Margin Percentage', 'readOnly': 'true'},
        {'value': 'Gross Income', 'readOnly': 'true'},
        {'value': 'Rating', 'readOnly': 'true'}
        ]
    ]

    # loop through dataframe and add to grid
    for i in range(0, len(dataframe), +1):
        row = [
            {'value': i, 'readOnly': 'true'},
            {'value': dataframe['Invoice ID'][i], 'readOnly': 'true'},
            {'value': dataframe['Branch'][i], 'readOnly': 'true'},
            {'value': dataframe['City'][i], 'readOnly': 'true'},
            {'value': dataframe['Customer type'][i], 'readOnly': 'true'},
            {'value': dataframe['Gender'][i], 'readOnly': 'true'},
            {'value': dataframe['Product line'][i], 'readOnly': 'true'},
            {'value': dataframe['Unit price'][i], 'readOnly': 'true'},
            {'value': dataframe['Quantity'][i], 'readOnly': 'true'},
            {'value': dataframe['Tax 5%'][i], 'readOnly': 'true'},
            {'value': dataframe['Total'][i], 'readOnly': 'true'},
            {'value': dataframe['Date'][i], 'readOnly': 'true'},
            {'value': dataframe['Time'][i], 'readOnly': 'true'},
            {'value': dataframe['Payment'][i], 'readOnly': 'true'},
            {'value': dataframe['cogs'][i], 'readOnly': 'true'},
            {'value': dataframe['gross margin percentage'][i], 'readOnly': 'true'},
            {'value': dataframe['gross income'][i], 'readOnly': 'true'},
            {'value': dataframe['Rating'][i], 'readOnly': 'true'}
        ]
        grid.append(row)

    return jsonify(grid)


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0')
    # from waitress import serve
    # serve(app, host='0.0.0.0') # use waitress