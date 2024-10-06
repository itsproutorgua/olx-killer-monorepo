import os

import django

from apps.locations.utils.locations.cities import cities
from apps.locations.utils.locations.regions import regions


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')

django.setup()


def create_regions_and_cities():
    from apps.locations.models import City
    from apps.locations.models.location import Location
    from apps.locations.models.region import Region

    for id_region, region_data in regions.items():
        name, slug = region_data['region'], region_data['slug']
        region_languages = region_data.get('languages')
        region, _ = Region.objects.get_or_create(
            name=name,
            name_uk=region_languages.get('uk'),
            name_en=region_languages.get('en'),
            name_ru=region_languages.get('ru'),
            slug=slug,
        )

        data_cities = cities[name]

        for data_city in data_cities:
            name = data_city['name']
            city_languages = data_city.get('languages')
            latitude = data_city['latitude']
            longitude = data_city['longitude']
            location_type = data_city['location_type']
            city, _ = City.objects.get_or_create(
                name=name,
                name_uk=city_languages.get('uk'),
                name_en=city_languages.get('en'),
                name_ru=city_languages.get('ru'),
                region=region,
            )

            Location.objects.get_or_create(
                location_type=location_type, city=city, latitude=latitude, longitude=longitude
            )

    print('Finished creating regions and cities')


if __name__ == '__main__':
    create_regions_and_cities()
