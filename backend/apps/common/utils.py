from django.utils.translation import get_language


def get_sort_field_by_language(model, base_field_name='title', fallback_language='uk'):
    """
    Определяет поле для сортировки в зависимости от текущего языка.

    :param model: Модель для которой определяется поле.
    :param base_field_name: Базовое имя поля (например, 'title').
    :param fallback_language: Язык по умолчанию, если нет поля для текущего языка.
    :return: Строка с именем поля для сортировки.
    """
    language_code = get_language() or fallback_language
    sort_field = f'{base_field_name}_{language_code}'

    if sort_field not in [f.name for f in model._meta.fields]:
        sort_field = f'{base_field_name}_{fallback_language}'

    return sort_field
