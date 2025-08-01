from django.contrib import admin
from django.utils.html import format_html
from .models import Academic

@admin.register(Academic)
class AcademicAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at', 'updated_at')
    list_filter = ('category', 'created_at')
    search_fields = ('user__username', 'user__email', 'institution', 'department')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ()
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Academic Information', {
            'fields': ('institution', 'department', 'position', 'bio')
        }),
        ('Contact Information', {
            'fields': ('website', 'orcid_id', 'google_scholar_id')
        }),
        ('Verification', {
            'fields': ('verified', 'verification_document')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['verify_academics', 'unverify_academics']
    
    def verify_academics(self, request, queryset):
        updated = queryset.update(verified=True)
        self.message_user(request, f'{updated} academics were verified.')
    verify_academics.short_description = "Verify selected academics"
    
    def unverify_academics(self, request, queryset):
        updated = queryset.update(verified=False)
        self.message_user(request, f'{updated} academics were unverified.')
    unverify_academics.short_description = "Unverify selected academics"
