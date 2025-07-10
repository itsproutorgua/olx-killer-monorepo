from rest_framework.generics import ListAPIView
from apps.products.models.product import Product
from apps.products.serializers.product import ProductSerializer
from apps.users.models.profile import Profile
from rest_framework.permissions import AllowAny


class ReturnSellerProductsView(ListAPIView):
    queryset = Product.objects
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = self.queryset
        id = self.request.query_params.get('q')

        profile = Profile.objects.get(id=id)


        queryset = Product.objects.filter(seller=profile.user)

        return queryset