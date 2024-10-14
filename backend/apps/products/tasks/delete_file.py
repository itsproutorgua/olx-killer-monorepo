import os

from celery.exceptions import MaxRetriesExceededError

from apps.celery import app
from apps.log_config import logger


@app.task(name='delete_product_file', bind=True, max_retries=3, default_retry_delay=30)
def delete_product_file(self, file_path: str) -> None:
    """Task to delete a file with the possibility of retrying"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.debug(f'File successfully deleted:{file_path}')
        else:
            logger.warning(f'File not found: {file_path}')
    except Exception as e:
        logger.warning(f'Error deleting file{file_path}: {str(e)}. Trying to repeat...')
        raise self.retry(exc=e)


def log_failure(self, exc, task_id, args, kwargs, einfo):
    """Signal for logging an error if all attempts to delete a file have been exhausted"""
    if isinstance(exc, MaxRetriesExceededError):
        file_path = args[0]
        logger.error(f'Failed to delete file after {self.max_retries} attempts: {file_path}')
    else:
        logger.error(f'Error executing task {self.name} with id {task_id}: {exc}')


delete_product_file.on_failure = log_failure
