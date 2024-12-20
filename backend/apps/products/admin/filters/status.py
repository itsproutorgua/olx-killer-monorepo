from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _


class ProductStatusFilter(SimpleListFilter):
    title = _('Announcement Status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('new', _('New')),
            ('old', _('Old')),
        ]

    def queryset(self, request, queryset):
        match self.value():
            case 'new':
                return queryset.filter(status='new')
            case 'old':
                return queryset.filter(status='old')

        return queryset
