from django.db.models.signals import post_delete
from django.dispatch import receiver

from apps.products.models import Product
from apps.products.models import ProductImage
from apps.products.models import ProductVideo
from apps.products.tasks import delete_product_file


@receiver(post_delete, sender=ProductImage)
def delete_image_file(sender, instance, **kwargs):
    """Removes the image file from the server when ProductImage is deleted using Celery task."""
    if instance.image:
        file_path = str(instance.image)
        if 'examples' not in file_path:
            delete_product_file.delay(file_path)
            instance.image.delete(save=False)


@receiver(post_delete, sender=Product)
def delete_product_images(sender, instance, **kwargs):
    """Removes image files from the server when a Product is deleted."""
    images = instance.product_images.all()
    for image in images:
        if image.image:
            file_path = str(instance.image)
            if 'examples' not in file_path:
                delete_product_file.delay(file_path)
        image.delete()


@receiver(post_delete, sender=ProductVideo)
def delete_video_file(sender, instance, **kwargs):
    """Removes the video file from the server when ProductVideo is uninstalled."""
    if instance.video:
        instance.video.delete(save=False)


@receiver(post_delete, sender=Product)
def delete_related_videos(sender, instance, **kwargs):
    """Removes all associated videos when deleting a product."""
    product_videos = ProductVideo.objects.filter(product=instance)
    for video in product_videos:
        video.delete()
