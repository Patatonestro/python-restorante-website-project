from django.apps import AppConfig


class PracticeConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "selfpractice"#这个地方要和installed app一致
