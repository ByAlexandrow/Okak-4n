from django.contrib import admin
from .models import Team

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'members', 'active_projects', 'availability')
    search_fields = ('name', 'type')
