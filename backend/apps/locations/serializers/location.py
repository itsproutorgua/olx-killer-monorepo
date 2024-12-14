from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.locations.models import Location


class LocationSerializer(serializers.ModelSerializer):
    region = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ('id', 'location_type', 'region', 'latitude', 'longitude')
        read_only_fields = ('id', 'location_type', 'region', 'latitude', 'longitude')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        location_type = representation['location_type']
        if location_type == 'city':
            name = instance.city.name
        elif location_type == 'village':
            name = instance.village.name
        else:
            name = None

        representation = {'id': representation.pop('id'), 'name': name, **representation}

        return representation

    @extend_schema_field(serializers.CharField)
    def get_region(self, obj) -> str | None:
        if obj.location_type == 'city' and obj.city:
            return obj.city.region.name
        elif obj.location_type == 'village' and obj.village:
            return obj.village.region.name
        return None
