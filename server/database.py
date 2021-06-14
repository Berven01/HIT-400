from mongoengine import connect
from models import User
from datetime import datetime
from encrypt import encrypt_password, check_encrypted_password


connect('sales-analytics', host='mongomock://localhost', alias='default')
# connect('sales-analytics', host='localhost', port=27017, alias='default')

def init_db():
    users = User.objects.all()