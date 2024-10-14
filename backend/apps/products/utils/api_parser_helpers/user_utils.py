import random

from django.contrib.auth import get_user_model
from faker import Faker

from apps.locations.models import Location
from apps.users.models.profile import Profile


User = get_user_model()
faker = Faker(['en_US', 'uk_UA', 'ru_RU'])
faker_ua = Faker('uk_UA')

# fmt: off
mobile_operators_ukraine = [
    '039', '067', '068', '096', '097', '098',  # Kyivstar
    '050', '066', '095', '099',  # Vodafone
    '063', '073', '093',  # Lifecell
    ]  # noqa: E123


# fmt: on


def get_email() -> str:
    existing_emails = set(User.objects.values_list('email', flat=True))
    email = faker.email()

    while email in existing_emails:
        email = faker.email()

    return email


def get_phones(user_data: dict) -> list[str]:
    phone_numbers: list = user_data.get('phone_numbers', [])
    if len(phone_numbers) == 0:
        for _ in range(1, random.randint(2, 3)):
            operator = random.choice(mobile_operators_ukraine)
            number = ''.join(str(random.randint(0, 9)) for _ in range(7))
            phone = f'+38{operator}{number}'
            phone_numbers.append(phone)

    return phone_numbers


def create_user(user_data: dict) -> User:
    user_olx_id = user_data['user_olx_id']
    locations = Location.objects.all()
    location = random.choice(locations)
    phone_numbers = get_phones(user_data)
    email = user_data.get('email', get_email())

    profile = Profile.objects.filter(user_olx_id=user_olx_id).first()
    if profile:
        return profile.user

    user, _ = User.objects.get_or_create(
        email=email,
        defaults={
            'username': user_data.get('username', faker.user_name()),
            'first_name': user_data.get('name', faker.first_name()),
            'last_name': user_data.get('last_name', faker.last_name()),
        },
    )

    profile, _ = Profile.objects.update_or_create(
        user=user,
        defaults={
            'location': location,
            'phone_numbers': phone_numbers,
            'is_fake_user': True,
        },
    )

    return user
