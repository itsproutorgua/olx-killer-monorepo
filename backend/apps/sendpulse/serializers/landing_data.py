from rest_framework import serializers

from apps.sendpulse.models.electron_ink import UserLeadsFromElectronInk


class SerializeFromElectronInk(serializers.ModelSerializer):
    class Meta:
        model = UserLeadsFromElectronInk
        fields = ['email', 'name', 'text']
