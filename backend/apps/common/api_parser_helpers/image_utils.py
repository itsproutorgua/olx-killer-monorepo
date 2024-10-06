import base64
from pathlib import Path

from django.core.files.base import ContentFile

from apps.products.models import Product, ProductImage


def check_image(product: Product, image_name: str) -> bool:
    images = ProductImage.objects.filter(product=product)
    return any(image_name == img.image.name.split('/')[-1] for img in images)


def save_image_without_data_image(product: Product):
    empty_img_path = str(Path('examples') / 'product_empty_image.jpg')
    existing_image = check_image(product, empty_img_path)
    if not existing_image:
        product_image = ProductImage.objects.create(product=product, image=empty_img_path)
        return product_image, bool(product_image)


def save_base64_image_to_product(image_data, product: Product) -> tuple[ProductImage, bool] | tuple[None, bool]:
    product_image, created = None, False

    data_image = image_data.get('data')
    file_name = image_data.get('name').split('.')[0]

    if 'base64,' in data_image:
        data_image = data_image.split('base64,')[1]

    image_binary = base64.b64decode(data_image)
    image_file = ContentFile(image_binary, name=f'{file_name}.jpg')
    existing_image = check_image(product=product, image_name=image_file.name)

    if not existing_image:
        product_image = ProductImage.objects.create(product=product, image=image_file)
        created = True

    return product_image, created
