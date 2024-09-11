from deep_translator import GoogleTranslator
from django.conf import settings
from django.db.models import Model


def translate_text(text: str, target_language: str) -> str | None:
    """Переводит текст на указанный язык с использованием GoogleTranslator."""
    try:
        return GoogleTranslator(target=target_language).translate(text)
    except Exception as e:
        print(f"Error translating to {target_language}: {e}")
        return None


def set_translated_field(instance, field_name, translated_text):
    """Устанавливает переведенный текст в поле модели."""
    if translated_text:
        setattr(instance, field_name, translated_text)


def translate_and_set_fields(
    instance: Model, field_name_prefix: str = "title", field_to_translate: str = "title"
):
    """
    Переводит и устанавливает значения для полей модели.

    :param instance: Экземпляр модели, в которой выполняется перевод.
    :param field_name_prefix: Префикс имени поля для перевода.
    :param field_to_translate: Имя поля, значение которого нужно перевести.
    """
    for code_lang, _ in settings.LANGUAGES:
        field_name = f"{field_name_prefix}_{code_lang}"
        current_value = getattr(instance, field_name, None)
        text_to_translate = getattr(instance, field_to_translate, None)

        if text_to_translate and not current_value:
            translated_text = translate_text(text_to_translate, code_lang)
            set_translated_field(instance, field_name, translated_text)
