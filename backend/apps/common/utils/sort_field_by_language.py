from django.utils.translation import get_language


def get_sort_field_by_language(model, base_field_name='title', fallback_language='uk') -> str:
    """
    Determines the field to use for sorting based on the current language.

    :param model: The model for which the field is determined.
    :param base_field_name: The base name of the field (e.g., 'title').
    :param fallback_language: The default language to use if no field exists for the current language.
    :return: A string representing the name of the field to use for sorting.
    """
    language_code = get_language() or fallback_language
    sort_field = f'{base_field_name}_{language_code}'

    if sort_field not in [f.name for f in model._meta.fields]:
        sort_field = f'{base_field_name}_{fallback_language}'

    return sort_field
