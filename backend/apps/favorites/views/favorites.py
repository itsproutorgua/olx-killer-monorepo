from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from rest_framework import mixins
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotAuthenticated
from rest_framework.response import Response

from apps.api_tags import FAVORITE_TAG
from apps.favorites.models import Favorite
from apps.favorites.serializers import UserFavoriteSerializer


class FavoriteViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Favorite.objects
    serializer_class = UserFavoriteSerializer

    def get_queryset(self):
        return (
            self.queryset.select_related('product')
            .prefetch_related('product__prices__currency', 'product__product_images')
            .filter(user=self.request.user)
            .order_by('-created_at')
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        tags=[FAVORITE_TAG],
        summary=_('List favorite items'),
        description=_('Returns a list of items that the user has marked as favorites.'),
        responses={
            status.HTTP_200_OK: OpenApiResponse(
                response=UserFavoriteSerializer(many=True),
                description=_('A list of favorite items for the user.'),
                examples=[
                    OpenApiExample(
                        'Example Response',
                        value={
                            'id': 0,
                            'product_details': {'id': 1, 'title': 'Example Product', 'price': '100 USD'},
                            'created_at': '2024-12-02T23:23:36.582Z',
                        },
                        response_only=True,
                    )
                ],
            ),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=NotAuthenticated.default_detail),
        },
    )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[FAVORITE_TAG],
        summary=_('Add item to favorites'),
        description=_(
            "Adds the specified product to the current user's favorites list. "
            'Provide the `id` of the product in the request body.'
        ),
        request=UserFavoriteSerializer,
        responses={
            status.HTTP_201_CREATED: OpenApiResponse(description=_('The item was successfully added to favorites.')),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(
                description=_('Validation error: product already in favorites.')
            ),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=NotAuthenticated.default_detail),
        },
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(status=status.HTTP_201_CREATED)

    @extend_schema(
        tags=[FAVORITE_TAG],
        summary=_('Remove item from favorites'),
        description=_(
            "Removes the specified product from the user's favorites list. Use the `id` of the product in the URL."
        ),
        responses={
            status.HTTP_204_NO_CONTENT: OpenApiResponse(description=_('Item successfully removed from favorites.')),
            status.HTTP_404_NOT_FOUND: OpenApiResponse(
                description=_('The specified favorite item does not exist or was not found.'),
            ),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=NotAuthenticated.default_detail),
        },
    )
    def destroy(self, request, *args, **kwargs):
        product_id = kwargs.get('pk')
        user = request.user

        favorite_item = get_object_or_404(Favorite, user=user, product_id=product_id)
        favorite_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
