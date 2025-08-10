from rest_framework import serializers
from .models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from dj_rest_auth.registration.serializers import RegisterSerializer as DefaultRegisterSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.utils.translation import gettext_lazy as _

class UserSerializer(serializers.ModelSerializer):
    isSuperuser = serializers.BooleanField(source='is_superuser', read_only=True)
    is_admin = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'date_joined', 'is_active', 'email_verified', 'first_name', 'last_name', 'is_admin', 'isSuperuser')
        read_only_fields = ('id', 'date_joined', 'email_verified')

User = get_user_model()

class CustomRegisterSerializer(DefaultRegisterSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password1', 'password2')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            is_active=True  # FIXED: Create users as active
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add both email and login fields as optional
        self.fields['email'] = serializers.CharField(required=False)
        self.fields['login'] = serializers.CharField(required=False)

    def validate(self, attrs):
        # Accept either login or email field
        login = attrs.get("login") or attrs.get("email") or attrs.get("username")
        password = attrs.get("password")

        if not login or not password:
            raise serializers.ValidationError(_("Must include 'login', 'email', or 'username' and 'password'."))

        user = None
        # Try authenticating with username
        user = authenticate(username=login, password=password)
        
        if not user:
            # Try authenticating with email
            try:
                user_obj = User.objects.get(email__iexact=login)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError(_("No active account found with the given credentials"))

        if not user.is_active:
            raise serializers.ValidationError(_("User account is disabled."))

        # Call parent validate with the found user's username
        # The parent serializer expects 'username' field.
        data = super().validate({'username': user.username, 'password': password})
        update_last_login(None, user)
        return data
