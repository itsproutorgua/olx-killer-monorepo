from pathlib import Path

from django.conf import settings
from django.db import models
from django.utils.translation import get_language
from django.utils.translation import gettext_lazy as _
from slugify import slugify

from apps.common.models import TimestampMixin
from apps.products.utils import translate_and_set_fields


class Category(TimestampMixin, models.Model):
    title = models.CharField(_('Category name'), max_length=100)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('Parent category'),
    )
    img = models.ImageField(_('Image'), upload_to='categories/images', blank=True, null=True)
    icon = models.ImageField(_('Icon'), upload_to='categories/icons', blank=True, null=True)
    cat_id_olx = models.IntegerField('Category ID OLX', blank=True, null=True)
    slug = models.SlugField(max_length=110)
    path = models.CharField(max_length=255, blank=True, unique=True)
    views = models.IntegerField(_('Views'), default=0)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'category'
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        unique_together = (('title', 'parent', 'cat_id_olx'),)

    @staticmethod
    def get_categories_tree():
        language_code = get_language() or settings.MODELTRANSLATION_DEFAULT_LANGUAGE
        title_field = f'title_{language_code}'

        category_fields = ['pk', title_field, 'path', 'icon', 'img', 'parent_id']
        categories = Category.objects.values(*category_fields).order_by('views')

        def format_media_url(field):
            return f'/media/{field}' if field else None

        categories_dict = {}

        for category in categories:
            categories_dict[category['pk']] = {
                'title': category[title_field],
                'path': category['path'],
                'icon': format_media_url(category['icon']),
                'img': format_media_url(category['img']),
                'parent_id': category['parent_id'],
                'children': [],
            }

        for cat_id, values in categories_dict.items():
            parent_id = values['parent_id']
            if parent_id:
                categories_dict[parent_id]['children'].append(values)

        return [{**values} for cat_id, values in categories_dict.items() if values['parent_id'] is None]

    def save(self, *args, **kwargs):

        if not self.slug and self.title:
            self.slug = slugify(self.title)

        if self.parent:
            self.path = f'{self.parent.path}/{self.slug}'
        else:
            self.path = f'{self.slug}'

        if self.title:
            translate_and_set_fields(self, field_name_prefix='title', field_to_translate='title')

        if not self.img:
            img_path = Path(f'media/categories/images/{self.slug}.png')
            if img_path.exists():
                self.img = f'categories/images/{self.slug}.png'

        if not self.icon:
            icon_path = Path(f'media/categories/icons/{self.slug}.svg')
            if icon_path.exists():
                self.icon = f'categories/icons/{self.slug}.svg'

        super().save(*args, **kwargs)
