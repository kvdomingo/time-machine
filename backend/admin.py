from django.contrib import admin
from .models import CheckIn


class CheckInAdmin(admin.ModelAdmin):
    list_display = ['author', 'created', 'duration', 'tag', 'activities']
    list_display_links = ['created']
    list_filter = ['author__username', 'created', 'tag']
    search_fields = ['author__username', 'author__first_name', 'author__last_name', 'tag', 'created']


admin.site.register(CheckIn, CheckInAdmin)

admin.site.index_title = 'Admin'
admin.site.site_title = 'Timing Machine'
admin.site.site_header = 'Timing Machine administration'
