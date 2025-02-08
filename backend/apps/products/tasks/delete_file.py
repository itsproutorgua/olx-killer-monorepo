import logging

import boto3
from botocore.exceptions import ClientError
from celery.exceptions import MaxRetriesExceededError
from django.conf import settings

from apps.celery import app


logger = logging.getLogger(__name__)


@app.task(name='delete_product_file', bind=True, max_retries=3, default_retry_delay=30)
def delete_product_file(self, file_key: str) -> None:
    """Task to delete a file from S3 with the possibility of retrying"""
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    s3_client = boto3.client('s3')
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=file_key)
        logger.debug(f'File successfully deleted from S3: {file_key}')
    except ClientError as e:
        logger.warning(f'Error deleting file from S3 {file_key}: {str(e)}. Trying to repeat...')
        raise self.retry(exc=e)


def log_failure(self, exc, task_id, args, kwargs, einfo):
    """Signal for logging an error if all attempts to delete a file have been exhausted"""
    if isinstance(exc, MaxRetriesExceededError):
        file_path = args[0]
        logger.error(f'Failed to delete file after {self.max_retries} attempts: {file_path}')
    else:
        logger.error(f'Error executing task {self.name} with id {task_id}: {exc}')


delete_product_file.on_failure = log_failure
