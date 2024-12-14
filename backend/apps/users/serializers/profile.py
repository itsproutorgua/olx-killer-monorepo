from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.locations.models import Location
from apps.locations.serializers.location import LocationSerializer
from apps.users.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(required=False)
    username = serializers.CharField(source='user.username', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.CharField(source='user.email', read_only=True)
    phone_numbers = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        help_text=_('A list of phone numbers (as strings).'),
    )
    last_login = serializers.CharField(source='user.last_login', read_only=True)
    location = serializers.SerializerMethodField()
    location_id = serializers.IntegerField(write_only=True, required=False, help_text=_('A location ID.'))

    class Meta:
        model = Profile
        fields = (
            'id',
            'picture',
            'username',
            'first_name',
            'last_name',
            'email',
            'phone_numbers',
            'location',
            'location_id',
            'last_login',
            'created_at',
        )
        read_only_fields = ('id', 'last_login', 'created_at')

    @extend_schema_field(LocationSerializer)
    def get_location(self, obj: Profile) -> LocationSerializer:
        return LocationSerializer(obj.location).data

    def update(self, instance: Profile, validated_data: dict) -> Profile:
        # User
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Location
        location_id = validated_data.pop('location_id', None)
        if location_id:
            try:
                location = Location.objects.get(id=location_id)
                instance.location = location
            except Location.DoesNotExist:
                raise serializers.ValidationError(
                    {'location_id': _('Invalid location ID.')},
                    code='invalid_location',
                )

        # Phone numbers
        phone_numbers = validated_data.pop('phone_numbers', None)
        if phone_numbers is not None:
            if not isinstance(phone_numbers, list):
                raise serializers.ValidationError(
                    {'phone_numbers': _('Expected a list of phone numbers.')},
                    code='invalid_phone_numbers',
                )
            instance.phone_numbers = phone_numbers

        # Profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        return instance
