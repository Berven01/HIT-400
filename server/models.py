from datetime import datetime
from mongoengine import Document, EmbeddedDocument
from mongoengine.fields import (
    DateTimeField, EmbeddedDocumentField,
    ListField, ReferenceField, StringField,
    ObjectIdField, IntField, BooleanField, FloatField
)

class User(Document):
    meta = {'collection': 'user'}
    firstname = StringField(required=True) 
    lastname = StringField(required=True)
    email = StringField(required=True) 
    phonenumber = IntField(required=True)
    address = StringField(required=True)
    password = StringField(required=True)
    role = StringField(required=True)
    verified = BooleanField(required=True)

class AccessTokens(Document):
    meta = {'collection': 'accesstokens'}
    user_id = StringField(required=True)
    active = BooleanField(required=True)
    signin_date = StringField(required=True)

class Transactions(Document):
    meta = {'collection': 'transactions'}
    amount = BooleanField(required=True)
    purchase_item = StringField(required=True)
    transaction_location = StringField(required=True)
    merchant = StringField(required=True)
    card_number = IntField(required=True)
    classification = StringField(required=True)
