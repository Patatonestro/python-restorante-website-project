from django.contrib import admin

# Register your models here.
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'slug']  # 显示哪些字段
    search_fields = ['title']