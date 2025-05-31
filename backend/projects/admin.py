from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'project_type', 'status', 'complexity', 'estimated_cost', 'timestamp')
    list_filter = ('status', 'complexity', 'project_type')
    search_fields = ('project_name', 'description', 'contact_email')
    readonly_fields = ('timestamp',)
