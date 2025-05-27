from rest_framework.generics import CreateAPIView
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from apps.sendpulse.serializers.landing_data import SerializeFromElectronInk
from apps.sendpulse.models.electron_ink import UserLeadsFromElectronInk

@extend_schema(
    tags=['Electron Ink Leads'],
    summary='Submit new lead from Electron Ink',
    description='''
    Endpoint для збору лідов з форми Electron Ink.
    Зберігає контактні дані користувачів, які залишили заявку.
    ''',
    request=SerializeFromElectronInk,
    responses={
        201: OpenApiResponse(
            description='Lead successfully created',
            response=SerializeFromElectronInk,
            examples=[
                OpenApiExample(
                    'Example response',
                    value={
                        'email': 'user@example.com',
                        'name': 'John Doe',
                        'text': 'Interested in your product'
                    }
                )
            ]
        ),
        400: OpenApiResponse(
            description='Validation error',
            examples=[
                OpenApiExample(
                    'Email required',
                    value={'email': ['This field is required.']}
                ),
                OpenApiExample(
                    'Invalid email',
                    value={'email': ['Enter a valid email address.']}
                )
            ]
        ),
    },
    examples=[
        OpenApiExample(
            'Example request',
            value={
                'email': 'user@example.com',
                'name': 'John Doe',
                'text': 'I want to know more about your services'
            },
            request_only=True
        )
    ]
)
class SaveElectronInkData(CreateAPIView):
    serializer_class = SerializeFromElectronInk
    queryset = UserLeadsFromElectronInk