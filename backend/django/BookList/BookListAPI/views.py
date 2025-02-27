from rest_framework import generics,permissions
from rest_framework import viewsets
from django.http import HttpResponse,JsonResponse,HttpResponseBadRequest,HttpResponseNotFound
from .models import MenuItem,Cart,Order,OrderItem,Category
from .serializers import MenuItemSerializer,OrderItemSerializer,OrderSerializer,CartSerializer,CategorySerializer
from .paginations import MenuItemListPagination
from .permissions import IsManager,IsDeliveryCrew
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.contrib.auth.models import User,Group
from rest_framework.throttling import UserRateThrottle,  AnonRateThrottle
from permissions import IsManager,IsDeliveryCrew
from rest_framework.exceptions import PermissionDenied,NotFound
from django.shortcuts import get_object_or_404
#User类用自带的djoser和jwt

#菜单列表
class MenuItemListView(generics.ListCreateAPIView):
    queryset=MenuItem.objects.all()
    serializer_class=MenuItemSerializer
    search_fields=['title','category__title']
    ordering_fields=['category','title']
    pagination_class=MenuItemListPagination
    throttle_classes=[AnonRateThrottle,UserRateThrottle]
        # 所有用户都可以查看菜单项列表
        # 只有经理才能创建菜单项
    def get_permissions(self):
        permission_list=[]
        if self.request.method!='GET':
            permission_list=[IsAdminUser,IsManager]
        return[permission() for permission in permission_list]

# 单个菜单项视图
class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=MenuItem.objects.all()
    serializer_class=MenuItemSerializer
    throttle_classes=[AnonRateThrottle,UserRateThrottle]
        # 所有用户都可以查看单个菜单项
        # 只有经理才能更新菜单项
    def get_permissions(self):
        permission_list=[]
        if self.request.method in['POST','DELETE','PATCH','PUT']:
            permission_list=[IsAdminUser,IsManager]
        return[permission() for permission in permission_list]
    #如果已经存在了不可以重复？
#User group management
class ManagerGroupView(viewsets.ViewSet):
    #只有经理操作这一类
    permission_classes = [IsManager]
    # return,post,delete
    def list(self,request):
        try:
            manager_group=Group.objects.get(name="Manager")
            managers=manager_group.user_set.all()
            return JsonResponse([{"id": user.id, "username": user.username} for user in managers])
        except Group.DoesNotExist:
            return JsonResponse({"detail": "Manager group not found"})
    def assign(self,request):
        user_id=request.data.get("user_id")
        try:
            user=User.objects.get(id=user_id)
            user.groups.add(manager_group)
            return JsonResponse({f"User {user.username} added to manager group."})
        except User.DoesNotExist:
            return JsonResponse({"message":"User not found!"})
    def delete(self,request):
        user=User.objects.get(id=user_id)
        manager_group=Group.objects.get(name="Manager")
        user.groups.remove(manager_group)
        return JsonResponse({"message":f"User {user.username} is removed from manager group"})
    
# 获取所有配送员
class DeliveryCrewGroupView(viewsets.ViewSet):
    permission_classes = [IsManager]
    def list(self,request):
        deliverycrew_group=Group.objects.get(name="DeliveryCrew")
        riders=deliverycrew_group.user_set.all()
        return JsonResponse([{"id": user.id, "username": user.username} for user in riders])
    def assign(self,request):
        user_id=request.data.get("user_id")
        try:
            user=User.objects.get(id=user_id)
            user.groups.add(deliverycrew_group)
            return JsonResponse({f"User {user.username} added to delivery crew group."})
        except User.DoesNotExist:
            return JsonResponse({"message":"User not found!"})
    def delete(self,request):
        user=User.objects.get(id=user_id)
        deliverycrew_group=Group.objects.get(name="DeliveryCrew")
        user.groups.remove(deliverycrew_group)
        return JsonResponse({"message":f"User {user.username} is removed from delivery crew group"})

#Cart management
class CartListView(generics.ListCreateAPIView):
    #只有客户操作这一类
    queryset=Cart.objects.all()
    serializer_class=CartSerializer
    def get_permissions(self):
        if self.request.method in['POST','DELETE','GET']:
            return [IsAuthenticated()]
        raise PermissionDenied("Method not allowed.")
    def delete(self, request):
        #, *args, **kwargs?
        #需要全部删除
        cart_items = Cart.objects.filter(user=request.user)
        cart_items.delete()
        return JsonResponse({"message": "Cart cleared."})


#Order management
#订单基础操作
#顾客get看自己所有订单和详细项目，post把购物车的加入订单然后清空购物车
#经理get看所有历史订单，put，patch把订单分配到骑手，查看订单状态,delete删订单
#骑手patch更新订单状态
class OrderOperationView(generics.ListCreateAPIView):
    queryset=Order.objects.all()
    serializer_class=OrderSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        elif self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        elif self.request.method in ['PUT', 'PATCH']:
            return [IsManager(),IsDeliveryCrew()]
        elif self.request.method == 'DELETE':
            return [IsManager()]
        raise PermissionDenied

    
    def create_order(self,request):
        cart_items = Cart.objects.filter(user=request.user)
        if not cart_items.exists():
            raise NotFound("Cart Empty!")
        
        order=Order.objects.create(user=request.user)
        total_price=0
        for item in cart_items:
            for item in cart_items:
                order_item = OrderItem.objects.create(
                order=order,
                menuitem=item.menuitem,
                quantity=item.quantity,
                unit_price=item.menuitem.price,
                price=item.quantity * item.menuitem.price
            )
            total_price += order_item.price
        
        order.total = total_price
        order.save()
        cart_items.delete()
        return JsonResponse({"message":"Order created!"})
    
    def assign_order(self,request):
        if not request.user.is_delivery_crew:
            raise PermissionDenied("Only manager assign!")
        order=get_object_or_404(Order,id=order_id)
        delivery_crew=User.objects.filter(name="DeliveryCrew")
        order.delivery_crew=delivery_crew
        order.save()
        return JsonResponse({"message":"Order assigned to rider!"})
        
    def delete_order(self,request):
        order=get_object_or_404(Order,id=order_id)
        order.delete()
        return (f"{order.orderId} deleted.")
    def update_status(self,request):
        if not request.user.is_delivery_crew:
            raise PermissionDenied("Only riders update.")
        order=get_object_or_404(Order,id=order_id)
        order.status=True
        order.save()
        return JsonResponse({"message":"Order status updated!"})
#具体点了什么，顾客需要get,put,patch更新菜单
# 骑手get看自己分配到的具体订单内容
class OrderDetailsView(generics.RetrieveUpdateAPIView):
    queryset=OrderItem.objects.all()
    serializer_class=OrderItemSerializer
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated(), IsDeliveryCrew()]
        elif self.request.method in ['PUT', 'PATCH']:
            return [permissions.IsAuthenticated()]
        raise PermissionDenied
    def get_details(self,request):
        user = self.request.user
        if user.groups.filter(name='DeliveryCrew').exists():
            return OrderItem.objects.filter(order__delivery_crew=user)
        elif user.is_authenticated:
            return OrderItem.objects.filter(order__user=user)
        else:
            raise PermissionDenied
    def update_details(self,request):
        #如果update应该只能修改数量
        order_item_id = self.kwargs.get('pk')
        order_item = get_object_or_404(OrderItem, id=order_item_id, order__user=request.user)
        
        new_quantity=request.data.get("quantity")
        if new_quantity is not None:
            if int(new_quantity)<=0:
                order_item.delete()
                return JsonResponse({f"You deleted {order_item.menuitem}"})
            order_item.quantity=int(new_quantity)
            order_item.price=order_item.price*order_item.quantity
            order_item.save()
            return JsonResponse({
                "message":"Item Updated",
                "menuitem":order_item.menuitem.title,
                "quantity":order_item.quantity,
                "price":order_item.price
            })
        return JsonResponse({"invalid operation"})