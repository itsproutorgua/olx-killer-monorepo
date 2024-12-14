from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.locations.serializers.location import LocationSerializer
from apps.users.models import Profile


class ProductProfileSerializer(serializers.ModelSerializer):
    picture_url = serializers.ImageField(source='picture', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    last_login = serializers.CharField(source='user.last_login', read_only=True)
    location = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = (
            'id',
            'picture_url',
            'username',
            'first_name',
            'last_name',
            'email',
            'phone_numbers',
            'location',
            'last_login',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')

    @extend_schema_field(LocationSerializer)
    def get_location(self, obj: Profile) -> LocationSerializer:
        return LocationSerializer(obj.location).data
