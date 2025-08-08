# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import Ad, Profile, Message

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password2": "Пароли не совпадают."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'avatar', 'bio']

class AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ['title', 'description', 'image_url', 'category', 'condition', 'user']

        def create(self, data):
            ad = User.objects.create(
                title=data['title'],
                description=data['description'],
                image_url=data['image_url'],
                category=data['category'],
                condition=data['condition'],
                user=data['user']
            )
            return ad

class ChangeAdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ['title', 'description', 'image_url', 'category', 'condition']

        def put(self, data):
            ad = User.objects.create(
                title=data['title'],
                description=data['description'],
                image_url=data['image_url'],
                category=data['category'],
                condition=data['condition'],
            )
            return ad

class GetAdSerializer(serializers.ModelSerializer):
    # Включаем информацию о пользователе и его профиле
    user = UserSerializer(read_only=True)
    user_profile = ProfileSerializer(source='user.profile', read_only=True)

    class Meta:
        model = Ad
        fields = [
            'id',
            'title',
            'description',
            'image_url',
            'category',
            'condition',
            'user',
            'user_profile',
            'created_at'
        ]

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    class Meta:
        model = Message
        fields=[
            'id',
            'sender',
            'receiver',
            'content',
            'created_at',
            'is_read'
        ]
