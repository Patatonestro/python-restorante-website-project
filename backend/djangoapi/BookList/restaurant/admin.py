from django.contrib import admin

# Register your models here.
from .models import Menus
from .models import Booking

admin.site.register(Menus)
