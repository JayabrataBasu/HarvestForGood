from django.contrib import admin
from django.utils.html import format_html
from .models import ForumPost, Comment, Like, ForumTag

@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author_info', 'pinned', 'likes_count', 'comments_count', 'get_created_at', 'get_updated_at')
    list_filter = ('pinned', 'author', 'created_at')
    search_fields = ('title', 'content', 'guest_name')
    readonly_fields = ('created_at', 'updated_at', 'likes_count', 'comments_count')
    list_editable = ('pinned',)
    
    fieldsets = (
        ('Post Information', {
            'fields': ('title', 'content', 'pinned')
        }),
        ('Author Information', {
            'fields': ('author', 'guest_name', 'guest_affiliation', 'guest_email')
        }),
        ('Statistics', {
            'fields': ('likes_count', 'comments_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def author_info(self, obj):
        if obj.author:
            return format_html(
                '<strong>{}</strong><br><small>{}</small>',
                obj.author.username,
                obj.author.email
            )
        else:
            return format_html(
                '<strong>{}</strong> (Guest)<br><small>{}</small>',
                obj.guest_name or 'Anonymous',
                obj.guest_affiliation or 'No affiliation'
            )
    author_info.short_description = 'Author'
    
    def likes_count(self, obj):
        return obj.get_likes_count()
    likes_count.short_description = 'Likes'
    
    def comments_count(self, obj):
        return obj.comments.count()
    comments_count.short_description = 'Comments'

    def get_created_at(self, obj):
        return obj.created_at
    get_created_at.short_description = 'Created At'

    def get_updated_at(self, obj):
        return obj.updated_at
    get_updated_at.short_description = 'Updated At'
    
    actions = ['pin_posts', 'unpin_posts']
    
    def pin_posts(self, request, queryset):
        updated = queryset.update(pinned=True)
        self.message_user(request, f'{updated} posts were pinned.')
    pin_posts.short_description = "Pin selected posts"
    
    def unpin_posts(self, request, queryset):
        updated = queryset.update(pinned=False)
        self.message_user(request, f'{updated} posts were unpinned.')
    unpin_posts.short_description = "Unpin selected posts"

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author_info', 'content_preview', 'likes_count', 'created_at')
    search_fields = ('content', 'guest_name', 'post__title')
    list_filter = ('created_at', 'author')
    readonly_fields = ('likes_count',)
    
    def author_info(self, obj):
        if obj.author:
            return format_html(
                '<strong>{}</strong>',
                obj.author.username
            )
        else:
            return format_html(
                '<strong>{}</strong> (Guest)',
                obj.guest_name or 'Anonymous'
            )
    author_info.short_description = 'Author'
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content'
    
    def likes_count(self, obj):
        return obj.get_likes_count()
    likes_count.short_description = 'Likes'

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user_info', 'post', 'comment', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('user__username', 'guest_name', 'post__title')
    
    def user_info(self, obj):
        if obj.user:
            return format_html(
                '<strong>{}</strong>',
                obj.user.username
            )
        else:
            return format_html(
                '<strong>{}</strong> (Guest)',
                obj.guest_name or 'Anonymous'
            )
    user_info.short_description = 'User'

@admin.register(ForumTag)
class ForumTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'usage_count', 'posts_count')
    search_fields = ('name',)
    readonly_fields = ('usage_count', 'posts_count')
    
    def posts_count(self, obj):
        return obj.posts.count()
    posts_count.short_description = 'Posts using this tag'
    readonly_fields = ('usage_count', 'posts_count')
    
    def posts_count(self, obj):
        return obj.posts.count()
    posts_count.short_description = 'Posts using this tag'
