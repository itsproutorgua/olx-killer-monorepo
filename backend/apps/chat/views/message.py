from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from drf_spectacular.utils import OpenApiTypes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chat.models.message import Message


@extend_schema(
    tags=['Chat'],
)
class DeleteMessageView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Delete a message',
        description='Deletes a message sent by the authenticated user.',
        responses={
            204: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        'Message deleted successfully',
                        value={'status': 'success', 'message': 'Message deleted successfully'},
                    )
                ],
            ),
            404: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        'Message not found',
                        value={'detail': 'Not found.'},
                    )
                ],
            ),
        },
    )
    def delete(self, request, message_id):
        message = get_object_or_404(Message, id=message_id, sender=request.user)
        message.delete()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{message.chat_room.id}',
            {
                'type': 'message_deleted',
                'message': {
                    'message_id': message_id,
                    'deleted': True,
                },
            },
        )

        return Response(
            {'status': 'success', 'message': 'Message deleted successfully'}, status=status.HTTP_204_NO_CONTENT
        )


@extend_schema(
    tags=['Chat'],
)
class EditMessageView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Edit a message',
        description='Edits the text of a message sent by the authenticated user.',
        request={
            'application/json': {
                'schema': {
                    'type': 'object',
                    'properties': {'text': {'type': 'string', 'example': 'Updated message text'}},
                }
            }
        },
        responses={
            200: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        'Message updated successfully',
                        value={'status': 'success', 'message': 'Message updated successfully'},
                    )
                ],
            ),
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        'Invalid data',
                        value={'status': 'error', 'message': 'Invalid data'},
                    )
                ],
            ),
            404: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        'Message not found',
                        value={'detail': 'Not found.'},
                    )
                ],
            ),
        },
    )
    def put(self, request, message_id):
        message = get_object_or_404(Message, id=message_id, sender=request.user)
        new_text = request.data.get('text')
        if new_text:
            message.text = new_text
            message.save(update_fields=['text'])

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'chat_{message.chat_room.id}',
                {
                    'type': 'message_edited',
                    'message': {
                        'message_id': message_id,
                        'text': new_text,
                        'edited': True,
                    },
                },
            )

            return Response({'status': 'success', 'message': 'Message updated successfully'}, status=status.HTTP_200_OK)
        return Response({'status': 'error', 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
