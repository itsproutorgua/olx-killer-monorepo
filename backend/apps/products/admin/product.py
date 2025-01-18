from django.contrib import admin
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import get_language
from django.utils.translation import gettext_lazy as _
from simple_history.admin import SimpleHistoryAdmin

from apps.products.admin import filters
from apps.products.admin.inlines import PriceInline
from apps.products.admin.inlines import ProductImageInline
from apps.products.admin.inlines import ProductVideoInline
from apps.products.models.product import Product


@admin.register(Product)
class ProductAdmin(SimpleHistoryAdmin):
    list_display = ('title', 'seller', 'category', 'views', 'status', 'publication_status')
    readonly_fields = ('id', 'created_at', 'updated_at', 'seller', 'slug', 'prod_olx_id', 'views')
    list_display_links = ('title',)
    list_editable = ('status', 'publication_status')
    autocomplete_fields = ['category']
    search_fields = ('title', 'seller__email')
    ordering = ('-created_at',)
    list_filter = (
        filters.ProductPublicationFilter,
        filters.ProductStatusFilter,
        filters.PopularCategoryFilter,
    )
    inlines = [PriceInline, ProductImageInline, ProductVideoInline]
    show_full_result_count = False
    actions = (
        'set_status_new',
        'set_status_old',
        'set_active',
        'set_inactive',
        'set_rejected',
        'set_draft',
    )

    fieldsets = (
        (
            _('General'),
            {
                'fields': (
                    'title',
                    'status',
                    'description',
                    'category',
                    'params',
                    'seller',
                    'views',
                    'publication_status',
                    'id',
                    'slug',
                    'created_at',
                    'updated_at',
                    'prod_olx_id',
                )
            },
        ),
    )

    @admin.action(description=_('Set status to New for selected products'))
    def set_status_new(self, request, queryset):
        queryset.update(status=Product.Status.NEW)
        self.message_user(request, _("Status of selected products has been set to 'New'."), messages.SUCCESS)
        return queryset

    @admin.action(description=_('Set status to Old for selected products'))
    def set_status_old(self, request, queryset):
        queryset.update(status=Product.Status.OLD)
        self.message_user(request, _("Status of selected products has been set to 'Old'."), messages.SUCCESS)
        return queryset

    @admin.action(description=_("Set status to 'active' for selected products"))
    def set_active(self, request, queryset):
        queryset.update(publication_status=Product.PublicationStatus.ACTIVE)
        self.message_user(request, _('Selected products have been successfully activated.'), messages.SUCCESS)
        return queryset

    @admin.action(description=_("Set status to 'inactive' for selected products"))
    def set_inactive(self, request, queryset):
        queryset.update(publication_status=Product.PublicationStatus.INACTIVE)
        self.message_user(request, _('Selected products have been successfully inactivated.'), messages.SUCCESS)
        return queryset

    @admin.action(description=_("Set selected products to 'draft' status"))
    def set_draft(self, request, queryset):
        queryset.update(publication_status=Product.PublicationStatus.DRAFT)
        message = _("Selected products have been successfully moved to 'draft' status.")
        self.message_user(request, message, messages.SUCCESS)
        return queryset

    @admin.action(description=_("Set selected products to 'reject' status"))
    def set_rejected(self, request, queryset):
        queryset.update(publication_status=Product.PublicationStatus.REJECTED)
        self.message_user(request, _('Selected products have been successfully rejected.'), messages.SUCCESS)
        return queryset

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('category', 'seller')

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)

        if search_term and not queryset:
            current_language = get_language()
            title_field = f'title_{current_language}'

            search_term = search_term.strip()
            q1 = Q(**{f'category__{title_field}__icontains': search_term})
            queryset = Product.objects.filter(q1)

        return queryset.order_by('-created_at'), use_distinct

    def save_model(self, request, obj, form, change):
        if not change:
            obj.seller = request.user
        else:
            obj.updated_at = timezone.now()

        super().save_model(request, obj, form, change)
