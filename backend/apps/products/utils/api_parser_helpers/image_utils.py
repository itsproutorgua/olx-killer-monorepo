import base64
import io
from pathlib import Path

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from PIL import Image

from apps.products.models import Product
from apps.products.models import ProductImage


def check_image(product: Product, image_name: str) -> bool:
    images = ProductImage.objects.filter(product=product)
    return any(image_name == img.image.name.split('/')[-1] for img in images)


def save_image_without_data_image(product: Product):
    empty_img_path = str(Path('examples') / 'product_empty_image.jpg')
    existing_image = check_image(product, empty_img_path)
    if not existing_image:
        product_image = ProductImage.objects.create(product=product, image=empty_img_path)
        return product_image, bool(product_image)


def save_base64_image_to_product(image_data, product: Product) -> None:
    data_image = image_data.get('data')
    file_name = image_data.get('name').split('.')[0]

    if not data_image or 'base64,' not in data_image:
        raise ValidationError('Invalid image data')

    data_image = data_image.split('base64,')[1]

    try:
        image_binary = base64.b64decode(data_image)
    except (TypeError, ValueError) as e:
        raise ValidationError('Error decoding base64 image') from e

    try:
        image = Image.open(io.BytesIO(image_binary))
        image_format = image.format.lower()
    except (IOError, SyntaxError) as e:
        raise ValidationError('Invalid image file') from e

    file_extension = image_format if image_format != 'jpeg' else 'jpg'
    image_file_name = f'{file_name}.{file_extension}'

    existing_image = check_image(product=product, image_name=image_file_name)

    if not existing_image:
        image_file = ContentFile(image_binary, name=image_file_name)
        ProductImage.objects.create(product=product, image=image_file)
