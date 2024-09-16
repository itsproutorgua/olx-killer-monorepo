# Скрипт для перевода статических данных
# django-admin makemessages --all - Эта команда создаст или обновит файлы .po для все языков в системе
# django-admin compilemessages - Эта команда скомпилирует все, po файлы в соответствующие .mo файлы,
# которые будут размещены рядом с .po файлами в каталоге locale.

import os

import django
import polib
from deep_translator import GoogleTranslator
from django.conf import settings


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')
django.setup()


def get_po_file_path(language_code: str) -> str:
    """
    Получает путь к файлу .po для заданного языкового кода.

    :param language_code: Строка с кодом языка (например, 'uk', 'en').
    :return: Строка с полным путём к файлу .po.
    """
    return settings.BASE_DIR / f'locale/{language_code}/LC_MESSAGES/django.po'


def translate_po_file(path_to_po: str, language_code: str) -> None:
    """
    Переводит строки msgstr в файле .po, которые ещё не переведены.

    :param path_to_po: Строка с путём к файлу .po, который нужно перевести.
    :param language_code: Строка с кодом языка, на который нужно перевести (например, 'uk', 'en').
    """
    po = polib.pofile(path_to_po)
    for entry in po:
        if not entry.msgstr:
            try:
                translated_text = GoogleTranslator(target=language_code).translate(entry.msgid)
                entry.msgstr = translated_text
            except Exception as e:
                print(f'Ошибка при переводе {entry.msgid}: {e}')

    po.save()


def translate_all_po_files() -> None:
    """
    Переводит все .po файлы для всех языков, указанных в настройках Django.

    Проходит по каждому языку, определённому в `settings.LANGUAGES`, и вызывает
    функцию для перевода строк в соответствующем .po файле.
    """
    for code_lang, name_lang in settings.LANGUAGES:
        path = get_po_file_path(language_code=code_lang)

        translate_po_file(path_to_po=path, language_code=code_lang)
        print(f'Перевод для {name_lang} завершен.')


if __name__ == '__main__':
    translate_all_po_files()
