from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views import View
from .models import MenuItem
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from .serializers import MenuItemSerializer
from rest_framework import viewsets
from rest_framework.throttling import UserRateThrottle

#Throttling
class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    throttle_classes = [UserRateThrottle]  # 默认限流

    def get_throttles(self):
        if self.action in ['list', 'retrieve']:  # 只对 GET 请求限流
            return [UserRateThrottle()]
        return []

#User
class CurrentUserView(View):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return JsonResponse({
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

#Menu-item
class MenuItemListView(View):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 所有用户都可以查看菜单项列表
        menu_items = MenuItem.objects.all()
        serializer = MenuItemSerializer(menu_items, many=True,context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        # 只有经理才能创建菜单项
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can create menu items.")
        
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

# 单个菜单项视图
class MenuItemDetailView(View):
    permission_classes = [IsAuthenticated]  # 需要认证的用户才能访问

    def get(self, request, menu_item_id):
        # 所有用户都可以查看单个菜单项
        menu_item = MenuItem.objects.get(id=menu_item_id)
        serializer = MenuItemSerializer(menu_item)
        return Response(serializer.data)

    def put(self, request, menu_item_id):
        # 只有经理才能更新菜单项
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can update menu items.")
        
        menu_item = MenuItem.objects.get(id=menu_item_id)
        serializer = MenuItemSerializer(menu_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def patch(self, request, menu_item_id):
        return self.put(request, menu_item_id)

    def delete(self, request, menu_item_id):
        # 只有经理才能删除菜单项
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can delete menu items.")

        menu_item = MenuItem.objects.get(id=menu_item_id)
        menu_item.delete()
        return Response({"message": "Menu item deleted"}, status=204)

#User group management
class ManagerGroupView(View):
    #只有经理操作这一类
    permission_classes = [IsAuthenticated]
    # return all managers
    def get(self, request):
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can view the managers group.")

        managers = get_user_model().objects.filter(role='manager')
        managers_data = [{"id": manager.id, "username": manager.username} for manager in managers]
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can assign users to the manager group.")

        user_id = request.data.get("user_id")
        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)

        user.role = 'manager'
        user.save()
        return JsonResponse({"message": "User assigned to manager group"}, status=201)

    def delete(self, request, user_id):
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can remove users from the manager group.")

        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)

        user.role = 'customer'  # Or any other default role you want
        user.save()
        return JsonResponse({"message": "User removed from manager group"}, status=200)

# 获取所有配送员
class DeliveryCrewGroupView(View):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can view the delivery crew group.")

        delivery_crew = get_user_model().objects.filter(role='delivery_crew')
        delivery_crew_data = [{"id": crew.id, "username": crew.username} for crew in delivery_crew]
        return Response(delivery_crew_data)

    def post(self, request):
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can assign delivery crew.")

        order_id = request.data.get('order_id')
        delivery_crew_id = request.data.get('delivery_crew_id')

        # 查找订单和配送员
        try:
            order = Order.objects.get(id=order_id)
            delivery_crew = get_user_model().objects.get(id=delivery_crew_id, role='delivery_crew')
        except Order.DoesNotExist:
            return JsonResponse({"message": "Order not found"}, status=404)
        except get_user_model().DoesNotExist:
            return JsonResponse({"message": "Delivery crew not found"}, status=404)

        # 将配送员分配到订单
        order.delivery_crew = delivery_crew
        order.save()

        return JsonResponse({"message": "Delivery crew assigned to order"}, status=201)

    # 移除配送员（将订单的配送员字段设为 NULL）
    def delete(self, request, order_id):
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can remove delivery crew.")

        # 查找订单
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return JsonResponse({"message": "Order not found"}, status=404)

        # 移除配送员
        order.delivery_crew = None
        order.save()

        return JsonResponse({"message": "Delivery crew removed from order"}, status=200)

    def delete(self, request, user_id):
        if request.user.role != 'manager':
            raise PermissionDenied("Only managers can remove users from the delivery crew group.")
        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=404)

        user.role = 'customer'
        user.save()
        return JsonResponse({"message": "User removed from delivery crew group"}, status=200)

#Cart management
class CartView(View):
    permission_classes = [IsAuthenticated]
    #只有客户操作这一类
    def get(self, request):
        cart_items = Cart.objects.filter(user=request.user)
        serializer = CartSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        menu_item_id = request.data.get('menu_item_id')
        quantity = request.data.get('quantity')

        menu_item = MenuItem.objects.get(id=menu_item_id)
        price = menu_item.price * quantity
        cart_item = Cart.objects.create(
            user=request.user,
            menuitem=menu_item,
            quantity=quantity,
            unit_price=menu_item.price,
            price=price
        )
        return JsonResponse({"message": "Item added to cart", "cart_item": CartSerializer(cart_item).data}, status=201)

    def delete(self, request):
        Cart.objects.filter(user=request.user).delete()
        return JsonResponse({"message": "All items removed from cart"}, status=204)

#Order management
class OrderListView(View):
    permission_classes = [IsAuthenticated]

    # 获取订单（客户和配送员）
    def get(self, request, order_id=None):
        if request.user.role == 'customer':
            # 客户只能查看自己的订单
            if order_id:
                order = Order.objects.get(id=order_id, user=request.user)
                serializer = OrderSerializer(order)
                return JsonResponse(serializer.data)
            else:
                orders = Order.objects.filter(user=request.user)
                serializer = OrderSerializer(orders, many=True)
                return JsonResponse(serializer.data)
        elif request.user.role == 'delivery_crew':
            # 配送员只能查看与自己相关的订单
            orders = Order.objects.filter(delivery_crew=request.user)
            serializer = OrderSerializer(orders, many=True)
            return JsonResponse(serializer.data)
        else:
            raise PermissionDenied("Unauthorized access")

    # 更新订单（管理员）
    def put(self, request, order_id):
        if request.user.role != 'manager':
            raise PermissionDenied("You are not authorized to update this order.")

        # 只有管理员可以更新订单状态和指定配送员
        order = Order.objects.get(id=order_id)
        order.delivery_crew = request.data.get('delivery_crew', order.delivery_crew)
        order.status = request.data.get('status', order.status)

        if order.status == 0:
            order.status = 0  # Out for delivery
        elif order.status == 1:
            order.status = 1  # Delivered

        order.save()

        return JsonResponse({"message": "Order updated successfully"})

    # 更新订单状态（配送员）
    def patch(self, request, order_id):
        if request.user.role != 'delivery_crew':
            raise PermissionDenied("Only delivery crew can update order status.")
        
        # 配送员只能更新订单状态
        order = Order.objects.get(id=order_id, delivery_crew=request.user)
        order.status = request.data.get('status', order.status)

        if order.status == 0:
            order.status = 0  # Out for delivery
        elif order.status == 1:
            order.status = 1  # Delivered

        order.save()

        return JsonResponse({"message": "Order status updated successfully"})

    # 删除订单（客户）
    def delete(self, request, order_id):
        if request.user.role == 'customer':
            order = Order.objects.get(id=order_id, user=request.user)
            order.delete()
            return JsonResponse({"message": "Order deleted successfully"})
        else:
            raise PermissionDenied("Unauthorized access")
