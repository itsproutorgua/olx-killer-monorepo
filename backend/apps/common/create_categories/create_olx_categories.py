# создание категорий в бд
import os

import django

from apps.common.create_categories.olx_categories import categories


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.main")

django.setup()


def create_olx_categories(categories_tree: dict, parent: int = None):
    """
    Рекурсивно преобразует дерево категорий в плоский словарь с указанием родительских категорий.

    Аргументы:
        categories_tree (dict): Словарь, содержащий иерархическую структуру категорий.
        parent (int): ID родительской категории. По умолчанию None.
        # parent (str): Название родительской категории. По умолчанию None.

    Описание:
        Эта функция проходит по дереву категорий, создавая для каждой категории запись в плоском
        словаре `flat_categories`, которая включает название, путь и родительскую категорию.
        Для дочерних категорий функция рекурсивно вызывает саму себя, передавая название текущей категории
        в качестве родительской для следующего уровня.

    Возвращает:
        None: Функция изменяет глобальный словарь `flat_categories` на месте, добавляя категории.
    """
    from apps.products.models import Category

    for category_id, category_data in categories_tree.items():
        title = category_data.get("title")

        languages = category_data.get("languages")
        try:
            category, created = Category.objects.get_or_create(
                title=title,
                title_uk=languages.get("uk"),
                title_en=languages.get("en"),
                title_ru=languages.get("ru"),
                parent=parent,
            )

            category_data["server_id"] = category.id

            if "children" in category_data:
                create_olx_categories(
                    categories_tree=category_data["children"], parent=category
                )

        except Exception as e:
            print(f"Error creating category {title}: {e}")


if __name__ == "__main__":
    create_olx_categories(categories)
