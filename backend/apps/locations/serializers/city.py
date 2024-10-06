from rest_framework import serializers

from apps.locations.models import City
from apps.locations.serializers.region import RegionSerializer


class CitySerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = City
        fields = ['id', 'name', 'region']
