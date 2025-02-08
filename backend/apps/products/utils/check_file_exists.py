import logging

import boto3
from botocore.exceptions import ClientError
from django.conf import settings


logger = logging.getLogger(__name__)

s3_client = boto3.client('s3')

def file_exists_on_s3(key: str) -> bool:
    """
    Check if a file exists in S3.

    Args:
        key (str): The S3 key of the file.

    Returns:
        bool: True if the file exists, False otherwise.
    """
    try:
        s3_client.head_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            logger.warning(f'File not found on S3: {key}')
            return False
        else:
            logger.error(f'Error checking file on S3: {str(e)}')
            return False
