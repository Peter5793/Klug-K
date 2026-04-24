from dataclasses import dataclass


@dataclass(frozen=True)
class RestaurantContext:
    restaurant_id: str
    role: str


def build_restaurant_context(*args, **kwargs):
    raise NotImplementedError(
        "Implement restaurant_users-backed membership resolution after generating exact models from Supabase."
    )
