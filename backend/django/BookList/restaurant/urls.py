from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.home,name="home"),
    path('about/',views.about,name="about"),
    path('book/',views.book,name="book"),
    path('menu/',views.menu,name="menu"),
    path('menu_item/<int:pk>/',views.menu_item,name="menu_item"),

]
