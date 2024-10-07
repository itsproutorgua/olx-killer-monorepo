from django.db import models
from django.utils.translation import gettext_lazy as _

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
    img = models.ImageField(_('Image'), upload_to='categories', blank=True, null=True)
    cat_id_olx = models.IntegerField('Category ID OLX', blank=True, null=True)
    path = models.SlugField(_('Slug'), max_length=110)
    views = models.IntegerField(_('Views'), default=0)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.title:
            translate_and_set_fields(self, field_name_prefix='title', field_to_translate='title')

        super().save(*args, **kwargs)

    @classmethod
    def get_categories_tree(cls):
        """Получаем дерево категорий с использованием 2 запросов к базе данных."""
        categories = cls.objects.select_related('parent').prefetch_related('children').all()

        # Строим словарь для быстрого доступа к категориям по ID
        category_dict = {category.id: category for category in categories}

        tree = []
        for category in categories:
            if category.parent is None:  # Корневая категория
                tree.append(cls._build_tree(category, category_dict))

        return tree

    @classmethod
    def _build_tree(cls, category, category_dict):
        """Рекурсивно строим дерево категорий."""
        children = [
            cls._build_tree(child, category_dict) for child in category_dict.values()
            if child.parent == category
            ]
        return {
            'id': category.id,
            'title': category.title,
            'path': category.path,
            'img': category.img.url if category.img else None,
            'children': children,
            }

    class Meta:
        db_table = 'category'
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        unique_together = (('title', 'parent', 'cat_id_olx'),)
