from .views import MenuItemListView,MenuItemDetailView,ManagerGroupView,DeliveryCrewGroupView,CartListView,OrderDetailsView,OrderOperationView
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'groups/manager/users', ManagerGroupView, basename='manager-group')
router.register(r'groups/delivery-crew/users', DeliveryCrewGroupView, basename='delivery-crew-group')

urlpatterns = [
    path('', include(router.urls)),
    #用户类
    path('users',include('djoser.urls')),
    path('token/login/', include('djoser.urls.jwt')),
    path('auth', include('djoser.urls.authtoken')),
    #菜单类
    path('menu-items', MenuItemListView.as_view()),
    path('menu-items/<int:pk>', MenuItemDetailView.as_view()),
    #购物车
    path('cart/menu-items',CartListView.as_view(), name='cart_view'),
    #订单
    path('orders', OrderDetailsView.as_view(), name='order_customer'),
    path('orders/<int:pk>',  OrderDetailsView.as_view()),
    #订单管理
    path('orders', OrderOperationView.as_view(), name='order_admin'),
    path('orders/<int:pk>',  OrderOperationView.as_view()),
]
