def calculate_menu_item_cost(*args, **kwargs):
    raise NotImplementedError(
        "Implement menu cost derivation using menu_item_ingredients and supplies once exact models exist."
    )


def calculate_menu_item_margin(*args, **kwargs):
    raise NotImplementedError(
        "Implement runtime margin calculation after menu and supply models are mapped from Supabase."
    )
