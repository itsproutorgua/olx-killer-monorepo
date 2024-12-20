from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _


class ProductActivityFilter(SimpleListFilter):
    title = _('Active Status')
    parameter_name = 'active'

    def lookups(self, request, model_admin):
        return [
            ('active', _('Active products')),
            ('inactive', _('Inactive products')),
        ]

    def queryset(self, request, queryset):
        match self.value():
            case 'active':
                return queryset.filter(active=True)
            case 'inactive':
                return queryset.filter(active=False)

        return queryset
