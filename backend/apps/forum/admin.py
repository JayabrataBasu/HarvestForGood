from django.contrib import admin
from .models import ForumPost, Comment

class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'get_created_at', 'get_updated_at')
    list_filter = ('author',)
    search_fields = ('title', 'content')
    readonly_fields = ('created_at', 'updated_at')

    def get_created_at(self, obj):
        return obj.created_at
    get_created_at.short_description = 'Created At'

    def get_updated_at(self, obj):
        return obj.updated_at
    get_updated_at.short_description = 'Updated At'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'created_at')
    search_fields = ('content',)
    list_filter = ('created_at',)

admin.site.register(ForumPost, ForumPostAdmin)
