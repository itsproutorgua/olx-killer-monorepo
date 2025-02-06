from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _


class ProductStatusFilter(SimpleListFilter):
    title = _('Announcement Status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('new', _('New')),
            ('used', _('Used')),
        ]

    def queryset(self, request, queryset):
        match self.value():
            case 'new':
                return queryset.filter(status='new')
            case 'used':
                return queryset.filter(status='used')

        return queryset
