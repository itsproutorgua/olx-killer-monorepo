from rest_framework import serializers

from apps.locations.models import Location
from apps.locations.serializers import RegionSerializer


class LocationSerializer(serializers.ModelSerializer):
    region = RegionSerializer()

    class Meta:
        model = Location
        fields = ['location_type', 'region', 'latitude', 'longitude']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        location_type = representation['location_type']

        if location_type == 'city':
            representation['name'] = instance.city.name
        elif location_type == 'village':
            representation['name'] = instance.village.name

        return representation
