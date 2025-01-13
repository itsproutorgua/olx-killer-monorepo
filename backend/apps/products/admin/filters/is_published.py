from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _


class ProductPublishedFilter(SimpleListFilter):
    title = _('Publication Status')
    parameter_name = 'is_published'

    def lookups(self, request, model_admin):
        return [
            ('published', _('Published')),
            ('rejected', _('Rejected')),
        ]

    def queryset(self, request, queryset):
        match self.value():
            case 'published':
                return queryset.filter(is_published='published')
            case 'rejected':
                return queryset.filter(is_published='rejected')

        return queryset
