import textwrap

from django.contrib import admin
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import get_language
from django.utils.translation import gettext_lazy as _
from simple_history.admin import SimpleHistoryAdmin

from apps.products.admin import filters
from apps.products.admin.inlines import PriceInline
from apps.products.admin.inlines import ProductDeactivationFeedbackInline
from apps.products.admin.inlines import ProductImageInline
from apps.products.admin.inlines import ProductVideoInline
from apps.products.models import Price
from apps.products.models import ProductImage
from apps.products.models.product import Product


@admin.register(Product)
class ProductAdmin(SimpleHistoryAdmin):
    list_display = ('get_short_title', 'seller', 'category', 'views', 'status', 'publication_status', 'updated_at')
    readonly_fields = ('id', 'created_at', 'updated_at', 'slug', 'prod_olx_id', 'views')
    list_display_links = ('get_short_title',)
    list_editable = ('status', 'publication_status')
    autocomplete_fields = ['category']
    search_fields = ('title', 'seller__email')
    ordering = ('-created_at',)
    list_filter = (
        'publication_status',
        'status',
        filters.PopularCategoryFilter,
    )
    inlines = [PriceInline, ProductImageInline, ProductVideoInline, ProductDeactivationFeedbackInline]
    show_full_result_count = False
    actions = (
        'set_status_new',
        'set_status_used',
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

    @admin.display(description=_('Product name'), ordering='title')
    def get_short_title(self, obj):
        max_length = 20
        return textwrap.shorten(obj.title, width=max_length, placeholder='') or obj.title[:max_length]

    @admin.action(description=_('Set status to New for selected products'))
    def set_status_new(self, request, queryset):
        queryset.update(status=Product.Status.NEW)
        self.message_user(request, _("Status of selected products has been set to 'New'."), messages.SUCCESS)
        return queryset

    @admin.action(description=_('Set status to Used for selected products'))
    def set_status_used(self, request, queryset):
        queryset.update(status=Product.Status.USED)
        self.message_user(request, _("Status of selected products has been set to 'Used'."), messages.SUCCESS)
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
            queryset = queryset.filter(q1)

        return queryset, use_distinct

    def save_model(self, request, obj, form, change):
        if not change:
            obj.seller = request.user
        else:
            obj.updated_at = timezone.now()

        obj.save()

        if not obj.product_images.exists():
            ProductImage.objects.create(product=obj)

        if not obj.prices.exists():
            Price.objects.create(product=obj)

        super().save_model(request, obj, form, change)
