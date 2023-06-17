from app.db import Base, database


def create_model_meta(tablename: str):
    return type(
        "Meta", (),
        {
            "tablename": tablename,
            "metadata": Base.metadata,
            "database": database
        }
    )
