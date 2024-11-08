from django.contrib import admin
from django.db.models import Count
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils.translation import gettext_lazy as _

from apps.products.models import Category


class PopularCategoryFilter(admin.SimpleListFilter):
    """
    Admin filter for selecting popular categories with a minimum number of associated products.

    - `POPULAR_CATEGORY_THRESHOLD` (int): Minimum number of products associated
    with a category to be considered "popular".
    - `LIMIT` (int): Maximum number of popular categories to display in the filter.

    The filter shows categories that have a product count greater than or equal to `POPULAR_CATEGORY_THRESHOLD` and
    sorts them in descending order of the product count. Up to `LIMIT` categories are shown.

    Attributes:
        title (str): The title of the filter, displayed in the admin.
        parameter_name (str): The query parameter name used in the URL.
    """

    POPULAR_CATEGORY_THRESHOLD: int = 100
    LIMIT: int = 21

    title: str = _('Popular Categories')
    parameter_name: str = 'popular_category'

    def lookups(self, request: HttpRequest, model_admin: admin.ModelAdmin) -> list[tuple[int, str]]:
        """
        Returns a list of tuples representing popular categories for display in the filter.

        Parameters:
            request (HttpRequest): The HTTP request object, which can provide user information.
            model_admin (ModelAdmin): The model admin instance that this filter is being used in.

        Returns:
            list[tuple[int, str]]: A list of tuples, each containing a category ID and its title.
        """
        popular_categories = (
            Category.objects.annotate(count_products=Count('products'))
            .filter(count_products__gte=self.POPULAR_CATEGORY_THRESHOLD)
            .order_by('-count_products')[: self.LIMIT]
        )

        return [(cat.id, cat.title) for cat in popular_categories]

    def queryset(self, request: HttpRequest, queryset: QuerySet) -> QuerySet:
        """
        Filters the queryset based on the selected popular category.

        Parameters:
            request (HttpRequest): The HTTP request object, used here to identify the current page.
            queryset (QuerySet): The original queryset to filter.

        Returns:
            QuerySet: The filtered queryset, based on the chosen category if selected.
        """
        if self.value():
            field = ('category_id', 'id')['category' in request.path]
            return queryset.filter(**{field: self.value()})
        return queryset
