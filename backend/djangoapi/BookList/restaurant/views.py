from django.shortcuts import render
from .models import Menus
from .forms import BookingForm
# Create your views here.
def home(request):
    return render(request,"home.html")
def about(request):
    about_content = {'about': "Little Lemon is a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist. The chefs draw inspiration from Italian, Greek, and Turkish culture and have a menu of 12–15 items that they rotate seasonally. The restaurant has a rustic and relaxed atmosphere with moderate prices, making it a popular place for a meal any time of the day."}
    return render (request,"about.html",{'content': about_content})
def book(request):
    form = BookingForm()
    if request.method =='POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            form.save()
    context = {'form': form}
    return render(request,"book.html",context)
def menu(request):
    menu_data=Menus.objects.all()
    main_data={"menu":menu_data}
    return render(request,"menu.html",{"menu":main_data})

def menu_item(request, pk=None):
    if pk:
        menu_item=Menus.objects.get(pk=pk)
    else:
        menu_item=""
    return render(request,'menu_item.html',{"menu_item":menu_item})
