from rest_framework import permissions

class IsManager(permissions.BasePermission):
    def has_permission(self,request,views):
        return request.user.groups.filter(name='Managers').exists()
class IsDeliveryCrew(permissions.BasePermission):
    def has_permission(self,request,views):
        return request.user.groups.filter(name='DeliveryCrew').exists()