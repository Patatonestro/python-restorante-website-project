from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet

router = DefaultRouter()
router.register(r'menu-items', MenuItemViewSet)
urlpatterns = [
    #用户类
    path('users',include('djoser.urls')),
    path('users/users/me/',views.CurrentUserView.as_view(), name='current_user'),
    path('token/login/', include('djoser.urls.jwt')),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    #菜单类
    path('menu-items', views.MenuItemListView.as_view(), name='menu-item-list'),
    path('menu-items', views.MenuItemListView.as_view(), name='menu-item-create'),
    path('menu-items/<int:menu_item_id>', views.MenuItemDetailView.as_view(), name='menu-item-detail'),
    path('menu-items/<int:menu_item_id>', views.MenuItemDetailView.as_view(), name='menu-item-update'),
    path('menu-items/<int:menu_item_id>', views.MenuItemDetailView.as_view(), name='menu-item-delete'),
    #管理
    path('groups/manager/users',views.ManagerGroupView.as_view(),name='return_all_managers'),
    path('groups/manager/users/<int:user_id>', views.ManagerGroupView.as_view(), name='remove_from_manager_group'),
    #管理-配送员信息
    path('groups/delivery-crew/users', views.DeliveryCrewGroupView.as_view(), name='assign_delivery_crew_to_order'),
    path('groups/delivery-crew/users/<int:user_id>', views.DeliveryCrewGroupView.as_view(), name='remove_from_delivery_crew_group'),
    #购物车
    path('cart/menu-items',views.CartView.as_view(), name='cart_view'),
    path('cart/menu-items/add', views.CartView.as_view(), name='add_to_cart'),
    path('cart/menu-items/clear', views.CartView.as_view(), name='clear_cart'),
    #订单
    path('api/orders', views.OrderListView.as_view(), name='order_list'),
    path('api/orders/create', views.OrderListView.as_view(), name='create_order'),
    path('api/orders/<int:order_id>', views.OrderListView.as_view(), name='order_detail'),
    path('api/orders/<int:order_id>/update', views.OrderListView.as_view(), name='order_update'),
    path('api/orders/<int:order_id>/delete', views.OrderListView.as_view(), name='order_delete')

]
