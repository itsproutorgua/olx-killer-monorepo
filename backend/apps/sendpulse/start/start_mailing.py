import os
import django
from pysendpulse.pysendpulse import PySendPulse
from apps.sendpulse.models.electron_ink import UserLeadsFromElectronInk   

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')
django.setup()



API_USER_ID = os.getenv("API_USER_ID")
API_SECRET = os.getenv("API_SECRET")
TOKEN_STORAGE = os.getenv("TOKEN_STORAGE")
ADDRESS_BOOK_ID = os.getenv("ADDRESS_BOOK_ID")  

sp = PySendPulse(API_USER_ID, API_SECRET, TOKEN_STORAGE)

def add_subscribers_to_sendpulse():
    subscribers = UserLeadsFromElectronInk.objects.all()
    emails = []

    for subscriber in subscribers:
        emails.append({
            'email': subscriber.email,
            'variables': {
                'name': subscriber.name
            }
        })
    

    result = sp.add_emails_to_addressbook(ADDRESS_BOOK_ID, emails)
