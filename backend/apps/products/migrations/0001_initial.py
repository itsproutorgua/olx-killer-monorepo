# Generated by Django 5.1 on 2024-10-13 20:50

from decimal import Decimal

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Create date')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update date')),
                ('code', models.CharField(max_length=3, unique=True, verbose_name='Currency code')),
                ('symbol', models.CharField(blank=True, max_length=5, null=True, verbose_name='Currency symbol')),
                ('name', models.CharField(max_length=50, verbose_name='Currency name')),
            ],
            options={
                'verbose_name': 'Currency',
                'verbose_name_plural': 'Currencies',
                'db_table': 'currency',
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Create date')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update date')),
                ('title', models.CharField(max_length=100, verbose_name='Category name')),
                ('title_uk', models.CharField(max_length=100, null=True, verbose_name='Category name')),
                ('title_en', models.CharField(max_length=100, null=True, verbose_name='Category name')),
                ('title_ru', models.CharField(max_length=100, null=True, verbose_name='Category name')),
                ('img', models.ImageField(blank=True, null=True, upload_to='categories/images', verbose_name='Image')),
                ('icon', models.ImageField(blank=True, null=True, upload_to='categories/icons', verbose_name='Icon')),
                ('cat_id_olx', models.IntegerField(blank=True, null=True, verbose_name='Category ID OLX')),
                ('slug', models.SlugField(max_length=110)),
                ('path', models.CharField(blank=True, max_length=255, unique=True)),
                ('views', models.IntegerField(default=0, verbose_name='Views')),
                (
                    'parent',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='children',
                        to='products.category',
                        verbose_name='Parent category',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'db_table': 'category',
                'unique_together': {('title', 'parent', 'cat_id_olx')},
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Create date')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update date')),
                ('title', models.CharField(max_length=255, verbose_name='Product name')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Product description')),
                ('views', models.IntegerField(default=0, verbose_name='Views')),
                ('params', models.JSONField(blank=True, default=dict, null=True, verbose_name='Parameters')),
                ('prod_olx_id', models.IntegerField(blank=True, null=True, verbose_name='Product OLX ID')),
                ('slug', models.SlugField(max_length=255, unique=True, verbose_name='Product slug')),
                (
                    'category',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name='products',
                        to='products.category',
                        verbose_name='Category',
                    ),
                ),
                (
                    'seller',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='seller_products',
                        to=settings.AUTH_USER_MODEL,
                        verbose_name='Seller',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
                'db_table': 'product',
                'unique_together': {('title', 'seller', 'category')},
            },
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                (
                    'image',
                    models.ImageField(
                        blank=True,
                        help_text='Allowed image formats: image/jpeg, image/png, image/gif, image/webp',
                        null=True,
                        upload_to='products/images/%Y/%m/%d',
                        verbose_name='Image',
                    ),
                ),
                (
                    'product',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='product_images',
                        to='products.product',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Product Image',
                'verbose_name_plural': 'Product Images',
                'db_table': 'product_image',
            },
        ),
        migrations.CreateModel(
            name='ProductVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                (
                    'video',
                    models.FileField(
                        blank=True,
                        help_text='Allowed video formats: video/mp4, video/x-m4v, video/quicktime, video/x-msvideo, video/x-ms-wmv, video/wmv, video/x-flv, video/flv, video/x-matroska, video/mkv, video/webm, video/ogg',
                        null=True,
                        upload_to='products/videos/%Y/%m/%d',
                        verbose_name='Video',
                    ),
                ),
                (
                    'product',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='product_videos',
                        to='products.product',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Product Videos',
                'verbose_name_plural': 'Product Videos',
                'db_table': 'product_video',
            },
        ),
        migrations.CreateModel(
            name='Price',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Create date')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Update date')),
                (
                    'amount',
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=13,
                        validators=[
                            django.core.validators.MinValueValidator(
                                Decimal('0'), message='Must be greater than or equal to 0.'
                            )
                        ],
                        verbose_name='Amount',
                    ),
                ),
                (
                    'currency',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to='products.currency', verbose_name='Currency'
                    ),
                ),
                (
                    'product',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='prices',
                        to='products.product',
                        verbose_name='Product',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Price',
                'verbose_name_plural': 'Prices',
                'db_table': 'price',
                'unique_together': {('product', 'currency')},
            },
        ),
    ]
